import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import Spinner from "../Layout/Spinner";

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();
    this.emailInput = React.createRef();
    this.phoneInput = React.createRef();
    this.balanceInput = React.createRef();
    this.notesInput = React.createRef();
  }

  onSubmit = e => {
    e.preventDefault();

    const { client, firestore, history } = this.props;

    //updated client
    const updClient = {
      firstName: this.firstNameInput.current.value,
      lastName: this.lastNameInput.current.value,
      email: this.emailInput.current.value,
      phone: this.phoneInput.current.value,
      notes: this.notesInput.current.value,
      balance:
        this.balanceInput.current.value === ""
          ? 0
          : this.balanceInput.current.value
    };

    //update client in firestore
    firestore
      .update({ collection: "clients", doc: client.id }, updClient)
      .then(history.push("/client/:id"));
  };

  render() {
    const { client } = this.props;
    const { disableBalanceOnEdit } = this.props.settings;

    if (client) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn text-white btn-link">
                <i className="fas fa-angle-left mr-1" />
                Back to Clients
              </Link>
              <div className="card mt-5">
                <div className="card-header">
                  <p className="text-secondary" style={{ fontSize: "12px" }}>
                    Client ID: <span>{client.id}</span>{" "}
                  </p>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        minLength="2"
                        required
                        ref={this.firstNameInput}
                        defaultValue={client.firstName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        minLength="2"
                        required
                        ref={this.lastNameInput}
                        defaultValue={client.lastName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        required
                        ref={this.emailInput}
                        defaultValue={client.email}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        minLength="10"
                        required
                        ref={this.phoneInput}
                        defaultValue={client.phone}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="balance">Balance</label>
                      <input
                        type="text"
                        className="form-control"
                        name="balance"
                        ref={this.balanceInput}
                        defaultValue={client.balance}
                        disable={disableBalanceOnEdit}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="textArea">Edit notes</label>
                      <textarea
                        className="form-control"
                        id="textArea"
                        name="notes"
                        rows="3"
                        required
                        ref={this.notesInput}
                        defaultValue={client.notes}
                      />
                    </div>
                    <input
                      type="submit"
                      value="Save Changes"
                      className="btn btn-dark"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

EditClient.propTypes = {
  firestore: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    { collection: "clients", storeAs: "client", doc: props.match.params.id }
  ]),
  connect(({ firestore: { ordered } }, settings) => ({
    client: ordered.client && ordered.client[0],
    settings
  }))
)(EditClient);
