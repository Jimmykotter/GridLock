// import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import profileImage from './Assets/GRIDLOCK.jpeg'
import App from './App'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import GameBoard from './pages/gameboard'
import ErrorPage from './pages/errorPage'

import './styles/global.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
    <>
      <div className="page-wrapper">
        <img
          src={profileImage}
          className="page-logo"
          alt="Gridlock Logo"
        />
      </div>
      <App/>
    </>
      
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'gameboard', element: <GameBoard /> },
    ],
  },
])

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(
    <RouterProvider router={router} />
  )
