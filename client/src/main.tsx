import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import App from './App';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import ErrorPage from './pages/errorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,        // not the built-in Error
    children: [
      { index: true, element: <LoginPage /> }, 
      { path: 'login', element: <LoginPage /> },          // renders at "/"
      { path: 'signup', element: <SignupPage /> },         // "/login"
    ]
  }
]);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={router} />);
