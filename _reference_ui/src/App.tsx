import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { Game } from './components/Game';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // Redirect to login for demo purposes so the user sees the new screens immediately
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
