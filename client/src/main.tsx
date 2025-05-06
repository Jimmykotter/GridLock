import "./styles/global.css"
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

import profileImage from "./Assets/GRIDLOCK.jpeg"

const router = createBrowserRouter([
  {
    path: "/",
    element: (<>
      <img className="profile-image"
      src={profileImage}/>

  
      <App />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true,  element: <LoginPage />   },
      { path: "login",     element: <LoginPage />   },
      { path: "signup",    element: <SignupPage />  },
      { path: "gameboard", element: <GameBoard />   },
    ],            
  },            
]);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={router} />);
