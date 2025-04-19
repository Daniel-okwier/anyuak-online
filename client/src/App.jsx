import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider,
  Outlet
} from 'react-router-dom';
import './styles/global.css';

// Pages
import Home from './pages/Home'; 
import Dashboard from './pages/Dashboard'; 
import Auth from './pages/auth/Auth'; 
import NotFound from './pages/NotFound'; 

// Layouts
import Header from './component/layout/Header'; 
//import Footer from './component/layout/Footer'; 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<><Header /><main><Outlet /></main></>}>
      <Route index element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;