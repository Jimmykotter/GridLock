// import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';

import LoginPage  from './pages/Login';
import SignupPage from './pages/Signup';
import GameBoard  from './pages/gameboard';
import ErrorPage  from './pages/errorPage';

export default function App() {
  const location = useLocation();
  const transitions = useTransition(location, {
    keys: location.pathname,
    from:   { opacity: 0, transform: 'translateX(100%)' },
    enter:  { opacity: 1, transform: 'translateX(0%)'    },
    leave:  { opacity: 0, transform: 'translateX(-100%)' },
    config: { duration: 500 }
  });

  return (
    <div style={{
      position: 'relative',
      width:    '100%',
      height:   '100vh',
      overflow: 'hidden'
    }}>
      {transitions((style, loc) => (
        <animated.div
          style={{
            ...style,
            position: 'absolute',
            top:      0,
            left:     0,
            width:    '100%',
            height:   '100%'
          }}
        >
          <Routes location={loc} key={loc.pathname}>
            <Route path="/"         element={<LoginPage />}   />
            <Route path="/login"    element={<LoginPage />}   />
            <Route path="/signup"   element={<SignupPage />}  />
            <Route path="/gameboard" element={<GameBoard />}   />
            <Route path="*"         element={<ErrorPage />}   />
          </Routes>
        </animated.div>
      ))}
    </div>
  );
}
