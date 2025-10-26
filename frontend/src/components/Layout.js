import { useLocation } from 'react-router-dom';
import Footer from './Footer';

function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}

export default Layout;