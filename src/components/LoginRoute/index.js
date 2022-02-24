import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class LoginRoute extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  // event action for username input field

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  // event action for password input field

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  // success case

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 365})
    history.replace('/')
  }

  // Failure case

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  // post the username and password to backend for authentication

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const loginResponse = await fetch(url, options)
    const loginData = await loginResponse.json()
    if (loginResponse.ok === true) {
      this.onSubmitSuccess(loginData.jwt_token)
    } else {
      this.onSubmitFailure(loginData.error_msg)
    }
  }

  // Render Username Section in the Form

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          value={username}
          className="username-input-field"
          onChange={this.onChangeUserName}
          placeholder="Username"
        />
      </>
    )
  }

  // Render Password Section in the Form
  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          value={password}
          className="password-input-field"
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  // render method

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <h1 className="admin-heading">ADMIN UI</h1>
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginRoute
