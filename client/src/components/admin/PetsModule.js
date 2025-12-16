import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../features/notificationSlice';
import { Modal, Button } from 'react-bootstrap';

const PetsModule = () => {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name:'', species:'', breed:'', age:'', photo:'', photoUrl:'', status:'available' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const fetchPets = async () => {
    try {
      const res = await API.get('/pets', { params: { limit: 100 } });
      setPets(res.data.data || []);
    } catch (err) { dispatch(addNotification('Failed to load pets','error')); }
  };

  useEffect(()=>{ fetchPets(); }, []);

  const validate = () => {
    const errs = [];
    if (!form.name || !form.name.trim()) errs.push('Name is required');
    if (!form.species || !form.species.trim()) errs.push('Species is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const createPet = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;
    try {
      // prepare request (POST create or PUT update)
      const sendMultipart = !!file;
      if (editId) {
        if (sendMultipart) {
          const fd = new FormData();
          fd.append('name', form.name);
          fd.append('species', form.species);
          if (form.breed) fd.append('breed', form.breed);
          if (form.age) fd.append('age', form.age);
          fd.append('status', form.status);
          fd.append('photo', file);
          await API.put(`/pets/${editId}`, fd);
        } else {
          const payload = { ...form };
          if (form.photoUrl) payload.photoUrl = form.photoUrl;
          await API.put(`/pets/${editId}`, payload);
        }
      } else {
        if (sendMultipart) {
          const fd = new FormData();
          fd.append('name', form.name);
          fd.append('species', form.species);
          if (form.breed) fd.append('breed', form.breed);
          if (form.age) fd.append('age', form.age);
          fd.append('status', form.status);
          fd.append('photo', file);
          await API.post('/pets', fd);
        } else {
          const payload = { ...form };
          if (form.photoUrl) payload.photoUrl = form.photoUrl;
          await API.post('/pets', payload);
        }
      }
      setForm({ name:'', species:'', breed:'', age:'', photo:'', photoUrl:'', status:'available' });
      setFile(null);
      setPreview(null);
      setEditId(null);
      fetchPets();
      dispatch(addNotification(editId ? 'Pet updated' : 'Pet created','success'));
    } catch (err) { dispatch(addNotification('Create failed','error')); }
  };

  const removePet = async (id) => {
    if (!confirm('Delete pet?')) return;
    try {
      await API.delete(`/pets/${id}`);
      fetchPets();
      dispatch(addNotification('Pet deleted','success'));
    } catch (err) { dispatch(addNotification('Delete failed','error')); }
  };

  const openEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name || '', species: p.species || '', breed: p.breed || '', age: p.age || '', photo: '', photoUrl: p.photo || '', status: p.status || 'available' });
    setPreview(p.photo || null);
    setFile(null);
    setShowModal(true);
  };

  return (
    <div>
      <h5 className="mb-3">Manage Pets</h5>

      <div className="card mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">Create a new pet</h6>
            <small className="text-muted">Add pets to the system for adoption</small>
          </div>
          <div>
            <Button variant="success" onClick={() => { setEditId(null); setForm({ name:'', species:'', breed:'', age:'', photo:'', photoUrl:'', status:'available' }); setFile(null); setPreview(null); setShowModal(true); }}>Add Pet</Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Pet' : 'Add Pet'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {errors.map((e,i)=>(<li key={i}>{e}</li>))}
              </ul>
            </div>
          )}
          <form className="row g-3">
            <div className="col-md-12">
              <label className="form-label">Name</label>
              <input className="form-control" placeholder="e.g. Bella" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Species</label>
              <input className="form-control" placeholder="Dog, Cat, etc." value={form.species} onChange={e=>setForm({...form, species:e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Breed</label>
              <input className="form-control" placeholder="Breed (optional)" value={form.breed} onChange={e=>setForm({...form, breed:e.target.value})} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Age</label>
              <input className="form-control" placeholder="Years" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
            <div className="col-md-12">
              <label className="form-label">Photo (upload)</label>
              <input type="file" accept="image/*" className="form-control" onChange={e=>{
                const f = e.target.files[0];
                setFile(f || null);
                if (f) setPreview(URL.createObjectURL(f)); else setPreview(null);
              }} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Or Photo URL</label>
              <input className="form-control" placeholder="https://..." value={form.photoUrl} onChange={e=>setForm({...form, photoUrl:e.target.value})} />
            </div>
            {preview || form.photoUrl ? (
              <div className="col-md-12">
                <label className="form-label">Preview</label>
                <div>
                  <img src={preview || form.photoUrl} alt="preview" style={{maxWidth:'100%',maxHeight:240,objectFit:'contain',borderRadius:6}} />
                </div>
              </div>
            ) : null}
          </form>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={(e)=>{ createPet(e); setShowModal(false); }}>{editId ? 'Update' : 'Save'}</Button>
          </Modal.Footer>
      </Modal>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light"><tr><th></th><th>Name</th><th>Species</th><th>Breed</th><th>Age</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {pets.map(p=> (
              <tr key={p._id}>
                <td style={{width:80}}>{p.photo ? <img src={p.photo} alt="photo" style={{width:64,height:64,objectFit:'cover',borderRadius:6}} /> : <div style={{width:64,height:64,background:'#f0f0f0',borderRadius:6}}/>}</td>
                <td>{p.name}</td>
                <td>{p.species}</td>
                <td>{p.breed || '—'}</td>
                <td>{p.age ?? '—'}</td>
                <td><span className={`badge bg-${p.status==='available'?'success':p.status==='pending'?'warning':'secondary'}`}>{p.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={()=>openEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>removePet(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetsModule;
