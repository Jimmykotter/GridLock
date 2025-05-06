import ReactDOM from 'react-dom/client';
import "./styles/login.css";
import "./styles/signup.css";
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import App from './App';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import ErrorPage from './pages/errorPage';
import { GameBoard } from './pages/gameboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true,  element: <Login />   },
      { path: "login",     element: <Login />   },
      { path: "signup",    element: <Signup />  },
      { path: "gameboard", element: <GameBoard />   },
    ],            
  },            
]);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={router} />);
