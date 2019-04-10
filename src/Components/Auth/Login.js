import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";
import { notifyUser } from "../../Actions/notifyActions";
import Alert from "../Layout/Alert";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { firebase, notifyUser } = this.props;
    const { email, password } = this.state;

    firebase
      .login({ email, password })
      .catch(err =>
        notifyUser("Invalid Login. Check your password or email.", "error")
      );
  };

  render() {
    const { message, messageType } = this.props.notify;

    return (
      <div className="container">
        <div className="row justify-content-end">
          <div className="col-md-6">
            <h1 class="display-4 text-white mt-5">
              Find out who owes you money.
            </h1>
            <button className="btn btn-light btn-lg text-danger d-none d-lg-block mt-3">
              Log back in
            </button>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h1 className="text-center pb-4 pt-3">
                  <span className="text-warning">Log in to ClientC</span>
                </h1>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    {/* <label htmlFor="email">Email</label> */}
                    <input
                      type="text"
                      name="email"
                      required
                      value={this.state.email}
                      onChange={this.onChange}
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                  <div className="form-group">
                    {/* <label htmlFor="password">Password</label> */}
                    <input
                      type="text"
                      name="password"
                      required
                      value={this.state.password}
                      onChange={this.onChange}
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                  <div>
                    <p className="text-secondary" style={{ fontSize: "12px" }}>
                      For testing: <strong> test@test.com</strong> (password:
                      <strong> testing123</strong>)
                    </p>
                  </div>

                  {message ? (
                    <Alert message={message} messageType={messageType} />
                  ) : null}
                  <input type="submit" value="Login" className="btn btn-dark" />
                  <div className="mt-2 font-weight-lighter">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="mr-1"
                    />
                    <label for="scales">Remember me</label>
                  </div>
                  <div className="font-weight-lighter">
                    <Link to="/"> Forgot Password?</Link>{" "}
                  </div>
                  <div className="font-weight-lighter bg-light mt-3">
                    <p>
                      {" "}
                      New to ClientC? <Link to="/signup">
                        Sign up now »
                      </Link>{" "}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyUser: PropTypes.func.isRequired
};

export default compose(
  firebaseConnect(),
  connect(
    (state, props) => ({ notify: state.notify }),
    { notifyUser }
  )
)(Login);
