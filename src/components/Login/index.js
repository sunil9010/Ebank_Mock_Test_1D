import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userInput: '', pin: '', errorMsg: '', showSubmitError: false}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = msg => {
    this.setState({errorMsg: msg, showSubmitError: true})
  }

  userEnter = event => {
    this.setState({userInput: event.target.value})
  }

  userPsw = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitData = async event => {
    event.preventDefault()
    const {userInput, pin} = this.state
    const api = 'https://apis.ccbp.in/ebank/login'
    const userData = {user_id: userInput, pin}
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(api, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {userInput, pin, errorMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app">
        <div className="responsive">
          <div className="img-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="image"
            />
          </div>
          <div className="inner">
            <h1 className="heading">Welcome Back!</h1>
            <form className="form" onSubmit={this.onSubmitData}>
              <label htmlFor="user" className="label">
                User ID
              </label>
              <input
                type="text"
                id="user"
                className="input"
                value={userInput}
                onChange={this.userEnter}
                placeholder="Enter User ID"
              />
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                className="input"
                placeholder="Enter PIN"
                onChange={this.userPsw}
                value={pin}
              />
              <button type="submit" className="button">
                Login
              </button>
              {showSubmitError && <p className="error">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
