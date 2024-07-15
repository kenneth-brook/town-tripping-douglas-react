import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useHeightContext } from '../hooks/HeightContext';
import { useOrientation } from '../hooks/OrientationContext';
import '../sass/componentsass/LoginPage.scss';

const LoginPage = () => {
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const orientation = useOrientation();
  const [mode, setMode] = useState('login');

  useEffect(() => {
    updateHeights();
  }, [headerRef, footerRef, updateHeights]);

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <button type="submit">Login</button>
            <p>
              Don't have an account? <span className="register-link" onClick={() => setMode('register')}>Register</span>
            </p>
            <p>
              Can't remember your password? <span className="reset-link" onClick={() => setMode('reset')}>Reset</span>
            </p>
          </>
        );
      case 'register':
        return (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <div className="form-group">
              <label htmlFor="repeat-password">Repeat</label>
              <input type="password" id="repeat-password" required />
            </div>
            <button type="submit">Register</button>
            <p>
              Already have an account? <span className="login-link" onClick={() => setMode('login')}>Login</span>
            </p>
          </>
        );
      case 'reset':
        return (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <button type="submit">Reset Password</button>
            <p>
              Remembered your password? <span className="login-link" onClick={() => setMode('login')}>Login</span>
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const pageTitle = mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password';

  const pageTitleContent = (
    <div className="page-title">
      <h1>{pageTitle}</h1>
    </div>
  );

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary'
          ? 'landscape'
          : orientation === 'desktop'
          ? 'desktop internal-desktop'
          : 'portrait'
      }`}
    >
      <Header ref={headerRef} />
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        {pageTitleContent}
        <div className="login-container">
          <form>
            {renderForm()}
          </form>
        </div>
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
};

export default LoginPage;
