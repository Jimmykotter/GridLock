import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import App from './App';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ErrorPage from './pages/errorPage';
import GameBoard from './pages/gameboard';
import Stats from './pages/Stats';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true,  element: <LoginPage />   },
      { path: "login",     element: <LoginPage />   },
      { path: "signup",    element: <SignupPage />  },
      { path: "gameboard", element: <GameBoard />   },
      { path: 'stats', element: <Stats /> }
    ],            
  },            
]);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={router} />);
