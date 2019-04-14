import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";

class AddClient extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    balance: "",
    notes: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  canBeSubmitted() {
    const { firstName, phone } = this.state;

    return firstName.length > 1 && phone.length === 11;
  }

  handleInvalidSubmit(event, errors, values) {
    this.setState({ errors, values });
  }

  onSubmit = e => {
    if (!this.canBeSubmitted()) {
      e.preventDefault();
      return;
    }

    // clear form
    const newClient = this.state;
    const { firestore, history } = this.props;

    //if no balance, add 0
    if (newClient.balance === "") {
      newClient.balance = 0;
    }

    firestore
      .add({ collection: "clients" }, newClient)
      .then(() => history.push("/"));
  };

  render() {
    const { disableBalanceOnAdd } = this.props.settings;
    const isEnabled = this.canBeSubmitted();

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <Link to="/" className="btn btn-link text-white">
              <i className="fas fa-angle-left mr-2" />
              Back to Clients
            </Link>

            <div className="card mt-5 mb-5">
              <div className="card-header">
                <h1 className="">Add New Client</h1>
                <p style={{ fontSize: "12px", color: "grey" }}>
                  (For testing, don't use real names, email, and phone numbers.)
                </p>
                <AvForm className="needs-validation" onSubmit={this.onSubmit}>
                  <div className="form-group mt-3">
                    <label htmlFor="firstName">First Name</label>
                    <AvField
                      type="text"
                      className="form-control"
                      name="firstName"
                      minLength="2"
                      required
                      validate={{ pattern: { value: /^[a-zA-Z]*$/ } }}
                      errorMessage={"First Name required"}
                      onChange={this.onChange}
                      value={this.state.firstName}
                    />
                    <div className="invalid-tooltip">Looks good!</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <AvField
                      type="text"
                      className="form-control"
                      name="lastName"
                      minLength="2"
                      validate={{ pattern: { value: /^[a-zA-Z]*$/ } }}
                      required
                      errorMessage={"Last Name required"}
                      onChange={this.onChange}
                      value={this.state.lastName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <AvField
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      validate={{
                        pattern: {
                          value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
                        }
                      }}
                      errorMessage={"Email required"}
                      onChange={this.onChange}
                      value={this.state.email}
                    />
                  </div>
                  <div className="form-group">
                    <AvField
                      label="Phone Number"
                      type="tel"
                      className="form-control"
                      name="phone"
                      validate={{ tel: true }}
                      required
                      maxLength="11"
                      errorMessage={
                        "Phone Number required / *North American number only"
                      }
                      onChange={this.onChange}
                      value={this.state.phone}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="balance">Balance</label>
                    <AvField
                      type="text"
                      className="form-control"
                      name="balance"
                      required
                      errorMessage={"Add Balance owed"}
                      onChange={this.onChange}
                      value={this.state.balance}
                      disabled={disableBalanceOnAdd}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="textArea">Write a note</label>
                    <textarea
                      className="form-control"
                      id="textArea"
                      name="notes"
                      rows="3"
                      onChange={this.onChange}
                      value={this.state.notes}
                    />
                  </div>
                  {isEnabled && (
                    <input
                      type="submit"
                      value="Add Client"
                      className="btn btn-block btn-dark"
                    />
                  )}
                </AvForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddClient.propTypes = {
  firestore: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(),
  connect((state, props) => ({ settings: state.settings }))
)(AddClient);
