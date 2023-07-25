import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../hooks/authHook';

const RequireAuth = ({ children }) => {

  const { user, isAuthenticated, setAuth } = useStore();
  const navigate = useNavigate();
  const {REACT_APP_HOST_IP} = process.env
  // Check if user session has expired
  useEffect(() => {

    if (!user && !isAuthenticated) {

      fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth/refresh',
        { method: 'GET', credentials: 'include' }
      )
      .then(res => res.json() )
      .then(body => {
        if (body.success) setAuth(body.user, body.success);
        else {
          alert(body.message)
          navigate('/');
        }
      })
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return children;

}

export default RequireAuth;

// Reference for the RequireAuth component: 
// https://gist.github.com/mjackson/d54b40a094277b7afdd6b81f51a0393f