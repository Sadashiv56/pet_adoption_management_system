const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const Pet = require('../models/Pet');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// GET /api/pets - list with search, filters, pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, species, breed, minAge, maxAge } = req.query;
    const query = { status: 'available' };
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { breed: new RegExp(search, 'i') }];
    if (species) query.species = species;
    if (breed) query.breed = breed;
    if (minAge) query.age = Object.assign(query.age || {}, { $gte: Number(minAge) });
    if (maxAge) query.age = Object.assign(query.age || {}, { $lte: Number(maxAge) });
    const pets = await Pet.find(query)
      .skip((page-1)*limit)
      .limit(Number(limit));
    const total = await Pet.countDocuments(query);
    res.json({ data: pets, page: Number(page), total });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// GET pet details
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });
    res.json(pet);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Admin: Create pet (accepts optional file upload in field 'photo' or `photoUrl` in body)
router.post('/', [auth, roles('admin'), upload.single('photo'), [
  check('name','Name required').notEmpty(),
  check('species','Species required').notEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const data = { ...req.body };
    // if a file was uploaded, set photo to its public URL
    if (req.file) {
      const host = req.get('host');
      const proto = req.protocol;
      data.photo = `${proto}://${host}/uploads/${req.file.filename}`;
    }
    // allow explicit photoUrl field
    if (req.body.photoUrl) data.photo = req.body.photoUrl;
    const pet = new Pet(data);
    await pet.save();
    res.json(pet);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Admin: Update pet
router.put('/:id', auth, roles('admin'), upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const host = req.get('host');
      const proto = req.protocol;
      data.photo = `${proto}://${host}/uploads/${req.file.filename}`;
    }
    if (req.body.photoUrl) data.photo = req.body.photoUrl;
    const pet = await Pet.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });
    res.json(pet);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Admin: Delete pet
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });
    // Optionally remove related applications
    await Application.deleteMany({ pet: req.params.id });
    res.json({ msg: 'Pet removed' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
