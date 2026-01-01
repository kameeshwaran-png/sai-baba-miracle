import { useSelector } from 'react-redux';

const ADMIN_EMAIL = 'kameeshwaran@gmail.com';

export const useAdmin = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  return { isAdmin };
};

