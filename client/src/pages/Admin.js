import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import PetsModule from '../components/admin/PetsModule';
import ApplicationsModule from '../components/admin/ApplicationsModule';

const Admin = () => {
  const [active, setActive] = useState('pets');

  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();


  if (!auth.token) return navigate('/login');

  return (
    <div className="row">
      <div className="col-md-3 p-0"><Sidebar active={active} setActive={setActive} /></div>
      <div className="col-md-9">
        <div className="p-3">
          {active === 'pets' && <PetsModule />}
          {active === 'available' && <PetsModule />}
          {active === 'applications' && <ApplicationsModule />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
