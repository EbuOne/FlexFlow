import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Cards from './pages/Cards';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import Auth from './components/Auth';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'cards',
        element: <Cards />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'help',
        element: <Help />,
      },
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
            <h2 className="text-2xl font-semibold mb-2">Sayfa Bulunamadı</h2>
            <p>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
          </div>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);