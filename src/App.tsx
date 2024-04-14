import { Outlet, } from 'react-router-dom'
import { Toaster } from './components/ui/sonner';


const App = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <Outlet />
    </>
  );
};

export default App;
