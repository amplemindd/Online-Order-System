* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #111111;
  color: #f5f5f5;
}

.login-page {
  min-height: 100vh;
  width: 100%;
  background: #111111;
  padding: 60px 4%;
}

.login-container {
  width: 100%;
  max-width: 1000px;
}

.login-container h1 {
  font-size: 38px;
  margin: 0 0 24px;
  font-weight: 700;
}

.progress-line {
  height: 4px;
  width: 100%;
  background: #292929;
  margin-bottom: 44px;
}

.progress-line span {
  display: block;
  width: 50%;
  height: 100%;
  background: #247b5b;
}

.error-message {
  color: #65b995;
  font-size: 27px;
  margin: 0 0 44px 10px;
}

.error-message span {
  margin-right: 12px;
  font-size: 20px;
}

.account-title {
  font-size: 26px;
  margin-bottom: 50px;
}

.input-box {
  width: 100%;
  height: 100px;
  border: 2px solid #333333;
  border-radius: 6px;
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  overflow: hidden;
}

.input-icon {
  height: 100%;
  width: 135px;
  min-width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 2px solid #555555;
  font-size: 32px;
  color: #bdbdbd;
}

.input-box input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 35px;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 25px;
}

.input-box input::placeholder {
  color: #d0d0d0;
}

.show-password {
  height: 100%;
  padding: 0 22px;
  border: none;
  background: #292929;
  color: #eeeeee;
  font-size: 16px;
  cursor: pointer;
}

.forgot-password {
  margin-top: 58px;
  font-size: 24px;
  color: #bdbdbd;
}

.forgot-password a,
.register-text a {
  color: #6399cc;
  font-weight: bold;
  text-decoration: none;
}

.register-text {
  font-size: 24px;
  line-height: 1.6;
  margin-top: 35px;
  margin-bottom: 65px;
}

.login-button {
  width: 350px;
  max-width: 100%;
  height: 125px;
  border: none;
  border-radius: 8px;
  background: #222222;
  color: white;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background: #303030;
}

@media (max-width: 600px) {
  .login-page {
    padding: 30px 20px;
  }

  .login-container h1 {
    font-size: 30px;
  }

  .error-message {
    font-size: 18px;
    margin-bottom: 30px;
  }

  .account-title {
    font-size: 19px;
    margin-bottom: 30px;
  }

  .input-box {
    height: 68px;
  }

  .input-icon {
    width: 65px;
    min-width: 65px;
    font-size: 23px;
  }

  .input-box input {
    font-size: 17px;
    padding: 0 12px;
  }

  .show-password {
    padding: 0 10px;
    font-size: 12px;
  }

  .forgot-password,
  .register-text {
    font-size: 17px;
  }

  .register-text {
    margin-bottom: 40px;
  }

  .login-button {
    height: 75px;
    font-size: 23px;
  }
}