import React, { useEffect, useState } from 'react';
import API from '../api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../features/notificationSlice';

const Home = () => {
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchPets(); }, [page]);

  const fetchPets = async () => {
    const res = await API.get('/pets', { params: { page, limit: 6, search } });
    setPets(res.data.data);
  };

  const onSearch = async (e) => { e.preventDefault(); setPage(1); fetchPets(); };

  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const applyForPet = async (petId) => {
    if (!auth.token) return navigate('/login');
    try {
      const res = await API.post('/applications', { pet: petId });
      dispatch(addNotification('Application submitted', 'success'));
      fetchPets();
    } catch (err) {
      dispatch(addNotification(err.response?.data?.msg || err.message || 'Failed to apply', 'error'));
    }
  };

  return (
    <div>
      <h2>Available Pets</h2>
      <form className="mb-3 d-flex" onSubmit={onSearch}>
        <input className="form-control me-2" placeholder="Search by name or breed" value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="row">
        {pets.map(p => (
          <div className="col-md-4 mb-3" key={p._id}>
            <div className="card">
              {p.photo && <img src={p.photo} className="card-img-top" alt={p.name} />}
              <div className="card-body">
                <h5 className="card-title">{p.name} ({p.species})</h5>
                <p className="card-text">Breed: {p.breed || '—'} | Age: {p.age ?? '—'}</p>
                {p.status === 'available' && (
                  <button className="btn btn-primary" onClick={()=>applyForPet(p._id)}>Apply</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <button className="btn btn-secondary" onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
};

export default Home;
