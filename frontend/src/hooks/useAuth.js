import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, isAuthenticated, loading } = useSelector(s => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isCustomer = role === 'CUSTOMER';
  const isVendor = role === 'VENDOR';
  const isAdmin = role === 'ADMIN';

  return { user, role, isAuthenticated, loading, logout: handleLogout, isCustomer, isVendor, isAdmin };
}

export default useAuth;
