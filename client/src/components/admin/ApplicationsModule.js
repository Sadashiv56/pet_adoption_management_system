import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../features/notificationSlice';

const ApplicationsModule = () => {
  const [apps, setApps] = useState([]);
  const dispatch = useDispatch();

  const fetchApps = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await API.get('/applications', { headers });
      setApps(res.data || []);
    } catch (err) { dispatch(addNotification('Failed to load applications','error')); }
  };

  useEffect(()=>{ fetchApps(); }, []);

  const decide = async (id, decision) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await API.post(`/applications/${id}/decision`, { decision }, { headers });
      fetchApps();
      dispatch(addNotification('Decision saved','success'));
    } catch (err) { dispatch(addNotification('Action failed','error')); }
  };

  return (
    <div>
      <h5>Applications</h5>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead><tr><th>Pet</th><th>User</th><th>Message</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {apps.map(a => (
              <tr key={a._id}>
                <td>{a.pet?.name}</td>
                <td>{a.user?.name}</td>
                <td style={{maxWidth:300}}>{a.message || '—'}</td>
                <td>{a.status}</td>
                <td>
                  <button className="btn btn-sm btn-success me-2" onClick={()=>decide(a._id,'approved')}>Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>decide(a._id,'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsModule;
