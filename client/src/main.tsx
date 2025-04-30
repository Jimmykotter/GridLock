import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import App from './App';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ErrorPage from './pages/errorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,        // not the built-in Error
    children: [
      { index: true, element: <Login /> }, 
      { path: 'login', element: <Login /> },          // renders at "/"
      { path: 'signup', element: <Signup /> },         // "/login"
    ]
  }
]);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={router} />);
