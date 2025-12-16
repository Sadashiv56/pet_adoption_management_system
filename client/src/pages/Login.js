import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearMessages } from '../features/authSlice';
import { addNotification } from '../features/notificationSlice';

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState([]);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const errs = [];
    if (!form.email || !validateEmail(form.email)) errs.push('Please include a valid email');
    if (!form.password) errs.push('Password is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(form));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  useEffect(()=>{
    if (auth.error) setErrors([auth.error]);
    // when user object is available, redirect based on role
    if (auth.user) {
      setErrors([]);
      const role = auth.user.role || 'user';
      const dest = role === 'admin' ? '/admin' : '/dashboard';
      navigate(dest);
      dispatch(clearMessages());
    }
  }, [auth.error, auth.user, navigate, dispatch]);
  // also show toast via notifications
  useEffect(()=>{
    if (auth.error) dispatch(addNotification(auth.error, 'error'));
    if (auth.successMessage) dispatch(addNotification(auth.successMessage, 'success'));
  }, [auth.error, auth.successMessage]);

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Login</h3>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3"><input name="email" className="form-control" placeholder="Email" value={form.email} onChange={onChange} /></div>
        <div className="mb-3"><input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={onChange} /></div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
