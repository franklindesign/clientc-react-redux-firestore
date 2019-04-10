import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";

class AppNavBar extends Component {
  state = {
    isAuthenticated: false
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;

    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }

  onLogoutClick = e => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();
  };

  render() {
    const { isAuthenticated } = this.state;
    const { auth } = this.props;
    const { allowRegistration } = this.props.settings;

    return (
      <nav className="navbar navbar-expand-md bg-transparent navbar-dark  mb-4">
        <div className="container">
          <Link to="/" className="logo" />{" "}
          <h3 className="text-white mt-2">ClientC</h3>
          <button
            className="navbar-toggler text-white btn-transparent"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMain"
          >
            <i className="fas fa-bars text-white" />
          </button>
          <div className="collapse navbar-collapse" id="navbarMain">
            {isAuthenticated ? (
              <ul className="navbar-nav ml-auto">
                <li
                  className="nav-item nav-link  ml-auto"
                  style={{ color: "#d7d7d7" }}
                >
                  {auth.email} <i className="far fa-user" />
                </li>
                <li className="nav-item ml-auto">
                  <Link to="/" className="nav-link text-white  ">
                    Client List <i className="far fa-list-alt" />
                  </Link>
                </li>
                <li className="nav-item ml-auto">
                  <Link to="/settings" className="nav-link text-white">
                    Settings <i className="fas fa-user-cog" />
                  </Link>
                </li>
                <li className="nav-item ml-auto">
                  <a
                    href="#!"
                    className="nav-link text-white"
                    onClick={this.onLogoutClick}
                  >
                    Logout <i className="fas fa-sign-out-alt" />
                  </a>
                </li>
              </ul>
            ) : null}

            {allowRegistration && !isAuthenticated ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item ml-auto mt-1">
                  <Link to="/login" className="nav-link text-white">
                    Login
                  </Link>
                </li>
                <li className="nav-item  ml-auto mt-1">
                  <Link to="/signup" className="nav-link text-white ">
                    Sign Up
                  </Link>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </nav>
    );
  }
}

AppNavBar.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
)(AppNavBar);
