import React, { useEffect, useState } from 'react';
import API from '../api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../features/notificationSlice';

const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(()=>{ if (!auth.token) return navigate('/login'); fetchApps(); }, []);
  const dispatch = useDispatch();
  const fetchApps = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await API.get('/applications/me', { headers });
      setApps(res.data);
    } catch (err) { console.error('Fetch apps error:', err.response?.status, err.response?.data || err.message); dispatch(addNotification('Failed to load applications', 'error')); }
  };
  return (
    <div>
      <h3>My Applications</h3>
      <ul className="list-group">
        {apps.map(a => (
          <li key={a._id} className="list-group-item">
            {a.pet?.name} - <strong>{a.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
