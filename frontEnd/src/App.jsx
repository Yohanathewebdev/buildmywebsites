import Kavbar from './Kavbar';
import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './pages/Footer';

function App() {
  return (
    <>
      <Kavbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
