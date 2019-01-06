import React, { Component } from 'react';

import GoogleLogin from './components/GoogleLogin/GoogleLogin';
import GoogleLogout from './components/GoogleLogout/GoogleLogout';

import * as cognito from './utils/cognito';
import properties from './utils/properties'
import AWS from 'aws-sdk';

import './App.css';

class App extends Component {

  state = {
    user: null,
    errorLogin: false,
    sessionExpired: false,
    message: null
  }

  componentDidMount() {
    cognito.unauthenticated();
  }

  loginSuccessful = (googleUser) => {
    cognito.authenticatedWithGoogle(googleUser);

    this.setState({
      user: googleUser,
      errorLogin: false,
      sessionExpired: false
    });
  }

  loginFailed = (error) => {
    console.error(JSON.stringify(error));
    this.setState({ errorLogin: true });
  }

  logout = () => {
    this.setState({ user: null });

    cognito.unauthenticated();
  }

  sessionExpired = () => {
    this.setState({
      sessionExpired: true,
      user: null
    });
  }

  getFileFromS3 = () => {
    const s3 = new AWS.S3();
    const fileName = this.state.user ? 'authenticated.txt' : 'unauthenticated.txt';
    s3.getObject({
      Bucket: properties.bucketName,
      Key: fileName
    }, (error, data) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({ message: data.Body.toString() });
      }
    })
  }

  render() {
    let content = (
      <div>
        <p>Please log in with yout Google account.</p>
        <GoogleLogin
          onLoginSuccess={this.loginSuccessful}
          onLoginError={this.loginFailed}
          onSessionExpired={this.sessionExpired} />
      </div>
    );
    if (this.state.errorLogin) {
      content = (
        <div>
          <p>Something went wrong when attempting to log you in with Google. Please try again</p>
          <GoogleLogin
            onLoginSuccess={this.loginSuccessful}
            onLoginError={this.loginFailed}
            onSessionExpired={this.sessionExpired} />
        </div>
      );
    }
    if (this.state.user) {
      content = (
        <div>
          <p>Hello, {this.state.user.getBasicProfile().getName()}.</p>
          <GoogleLogout
            logoutSuccessful={this.logout} />
        </div>
      );
    }
    if (this.state.sessionExpired) {
      content = (
        <div>
          <p>Your session expired. Please log in again.</p>
          <GoogleLogin
            onLoginSuccess={this.loginSuccessful}
            onLoginError={this.loginFailed}
            onSessionExpired={this.sessionExpired} />
        </div>
      );
    }
    let message = null;
    if (this.state.message) {
      message = (<p>{this.state.message}</p>);
    }
    return (
      <div className="App">
        <header className="App-header">
          {content}

          <input type="button" onClick={this.getFileFromS3} value="GET" />

          {message}
        </header>
      </div>
    );
  }
}

export default App;
