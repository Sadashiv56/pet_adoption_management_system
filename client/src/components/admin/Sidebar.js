import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ active, setActive }) => {
  return (
    <div className="bg-light border" style={{ minHeight: '100vh', paddingTop: 20 }}>
      <div className="px-3 mb-3"><strong>Admin</strong></div>
      <Nav className="flex-column px-2">
        <Nav.Link active={active==='pets'} onClick={() => setActive('pets')}>Pets</Nav.Link>
        <Nav.Link active={active==='available'} onClick={() => setActive('available')}>Available Pets</Nav.Link>
        <Nav.Link active={active==='applications'} onClick={() => setActive('applications')}>Applications</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
