import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { notifyUser } from "../../Actions/notifyActions";
import { Link } from "react-router-dom";
import Alert from "../Layout/Alert";
import {
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      validate: {
        emailState: "",
        passwordState: ""
      }
    };
  }

  validateEmail(e) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    if (emailRegex.test(e.target.value)) {
      validate.emailState = "has-success";
    } else {
      validate.emailState = "has-danger";
    }
    this.setState({ validate });
  }

  validatePassword(e) {
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    const { validate } = this.state;
    if (passwordRegex.test(e.target.value)) {
      validate.passwordState = "has-success";
    } else {
      validate.passwordState = "has-danger";
    }
  }

  onChange = async event => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value
    });
  };

  componentWillMount() {
    const { allowRegistration } = this.props.settings;

    if (!allowRegistration) {
      this.props.history.push("/");
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const { firebase, notifyUser } = this.props;
    const { email, password } = this.state;

    // Register with Firebase
    firebase
      .createUser({ email, password })
      .catch(err => notifyUser("This user already exists."));
  };

  render() {
    // const { email, password } = this.state;
    const { message, messageType } = this.props.notify;

    return (
      <Container>
        <div className="row justify-content-end">
          <div className="col-md-6">
            <h1 className="display-4 text-white mt-5">
              Manage and track client payments.
            </h1>
            <div style={signup} className="d-none d-lg-block">
              Get started for free
            </div>
          </div>
          <div className="col-md-6">
            <div className="card" style={{ marginBottom: "50px" }}>
              <div className="card-body">
                <h1 className="text-center pb-4 pt-3">
                  <span className="text-warning">Create Your Account</span>
                </h1>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <label htmlFor="email">Use Email as Log in</label>
                    <Input
                      type="email"
                      name="email"
                      required
                      valid={this.state.validate.emailState === "has-success"}
                      invalid={this.state.validate.emailState === "has-danger"}
                      value={this.state.email}
                      onChange={e => {
                        this.validateEmail(e);
                        this.onChange(e);
                      }}
                    />
                    <FormFeedback valid>
                      Good! Your email looks legit.
                    </FormFeedback>
                    <FormFeedback invalid>
                      Uh oh! Looks like there is an issue with your email.
                      Please input a correct email.
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="password">Create a Password</Label>
                    <Input
                      type="password"
                      name="password"
                      required
                      valid={
                        this.state.validate.passwordState === "has-success"
                      }
                      invalid={
                        this.state.validate.passwordState === "has-danger"
                      }
                      onChange={e => {
                        this.validatePassword(e);
                        this.onChange(e);
                      }}
                    />
                    <FormFeedback valid>Password looks good!</FormFeedback>
                    <FormFeedback invalid>
                      Must contain at least one number and one uppercase and
                      lowercase letter, and at least 8 or more characters.
                    </FormFeedback>
                  </FormGroup>
                  {message ? (
                    <Alert message={message} messageType={messageType} />
                  ) : null}
                  <Input
                    type="submit"
                    value="Create Account"
                    className="btn btn-dark"
                  />

                  <div className="font-weight-lighter bg-light mt-3">
                    <p>
                      {" "}
                      Have an account? <Link to="/login">
                        Log in now »
                      </Link>{" "}
                    </p>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

const signup = {
  fontSize: "24px",
  color: "red",
  marginTop: "20px",
  padding: "10px",
  backgroundColor: "white",
  width: "50%",
  textAlign: "center"
};

Login.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyUser: PropTypes.func.isRequired
};

export default compose(
  firebaseConnect(),
  connect(
    (state, props) => ({ notify: state.notify, settings: state.settings }),
    { notifyUser }
  )
)(Login);
