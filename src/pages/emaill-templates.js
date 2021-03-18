import React from 'react';

const EmailTemplate = (props) => {
  return (
    <>
    <div className="email-template">
      <div className="logo-container">
        <img className="logo" src="/img/logo.png" />
      </div>
      <div className="email-header">
        Welcome to everydaybelievers.com!
      </div>
      <div className="email-content">
        <h4>Click the button below to confirm your email address.</h4>
        <p>If you believe you received this email in error, simply delete it and no further action is needed.</p>
        <a href="#">Confirm email</a>
      </div>
    </div>
    <div className="email-template">
      <div className="logo-container">
        <img className="logo" src="/img/logo.png" />
      </div>
      <div className="email-header">
        We heard you lost your password.
      </div>
      <div className="email-content">
        <h4>Click the button below to create a new password for your account.</h4>
        <p>If you believe you received this email in error, simply delete it and no further action is needed.</p>
        <a href="#">Reset password</a>
      </div>
    </div>
    <div className="email-template">
      <div className="logo-container">
        <img className="logo" src="/img/logo.png" />
      </div>
      <div className="email-header">
        Your password has been reset.
      </div>
      <div className="email-content">
        <h4>A new password for your account was just saved.</h4>
        <p>If you believe you received this email in error, or did request to create a new password for your account; reach out to our support team immediately.</p>
        <a href="#">Contact support</a>
      </div>
    </div>
    </>
  );
}

export default EmailTemplate;