const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const Application = require('../models/Application');
const Pet = require('../models/Pet');

// User: apply to adopt
router.post('/', [auth, roles('user'), [
  check('pet', 'Pet id is required').notEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { pet: petId, message } = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });
    if (pet.status !== 'available') return res.status(400).json({ msg: 'Pet not available' });
    const existing = await Application.findOne({ pet: petId, user: req.user.id });
    if (existing) return res.status(400).json({ msg: 'You already applied for this pet' });
    const application = new Application({ pet: petId, user: req.user.id, message });
    await application.save();
    // mark pet as pending
    pet.status = 'pending';
    await pet.save();
    res.json(application);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// User: get own applications
router.get('/me', auth, roles(['user','admin']), async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).populate('pet');
    res.json(apps);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Admin: view all applications
router.get('/', auth, roles('admin'), async (req, res) => {
  try {
    const apps = await Application.find().populate('pet').populate('user', '-password');
    res.json(apps);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Admin: approve/reject
router.post('/:id/decision', auth, roles('admin'), async (req, res) => {
  try {
    const { decision } = req.body; // 'approved' or 'rejected'
    if (!['approved','rejected'].includes(decision)) return res.status(400).json({ msg: 'Invalid decision' });
    const app = await Application.findById(req.params.id).populate('pet');
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    app.status = decision;
    await app.save();
    if (decision === 'approved'){
      app.pet.status = 'adopted';
      await app.pet.save();
      // reject other pending apps for same pet
      await Application.updateMany({ pet: app.pet._id, _id: { $ne: app._id }, status: 'pending' }, { status: 'rejected' });
    } else {
      // if rejected and no other approved, set pet available
      const otherPending = await Application.findOne({ pet: app.pet._id, status: 'pending' });
      if (!otherPending) {
        app.pet.status = 'available';
        await app.pet.save();
      }
    }
    res.json(app);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
