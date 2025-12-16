import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../features/notificationSlice';

const Toasts = () => {
  const notifications = useSelector(s => s.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    notifications.forEach(n => {
      // auto remove after 4s
      setTimeout(() => dispatch(removeNotification(n.id)), 4000);
    });
  }, [notifications.length]);

  if (!notifications.length) return null;

  return (
    <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1060 }}>
      {notifications.map(n => (
        <div key={n.id} className={`alert alert-${n.type === 'error' ? 'danger' : n.type} mb-2`} role="alert">
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default Toasts;
