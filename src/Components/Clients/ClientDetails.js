import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import Spinner from "../Layout/Spinner";
import classnames from "classnames";

class ClientDetails extends Component {
  state = {
    showBalanceUpdate: false,
    balanceUpdateAmount: ""
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  //update balance
  balanceSubmit = e => {
    e.preventDefault();

    const { client, firestore } = this.props;
    const { balanceUpdateAmount } = this.state;

    const clientUpdate = {
      balance: parseFloat(balanceUpdateAmount)
    };

    // update in firestore
    firestore.update({ collection: "clients", doc: client.id }, clientUpdate);
  };

  //delete client
  onDeleteClick = () => {
    const { client, firestore, history } = this.props;
    firestore
      .delete({ collection: "clients", doc: client.id })
      .then(() => history.push("/"));
  };

  render() {
    const { client } = this.props;
    const { showBalanceUpdate, balanceUpdateAmount } = this.state;

    let balanceForm = "";
    // If balance form should display
    if (showBalanceUpdate) {
      balanceForm = (
        <form onSubmit={this.balanceSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="balanceUpdateAmount"
              placeholder="Adjust Balance"
              value={balanceUpdateAmount}
              className="form-control"
              onChange={this.onChange}
            />
            <div className="input-group-append">
              <input
                type="submit"
                defaultValue="update"
                className="btn btn-dark"
              />
            </div>
          </div>
        </form>
      );
    } else {
      balanceForm = null;
    }

    if (client) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn btn-link text-white">
                <i className="fas fa-angle-left mr-1" />
                Back to Clients
              </Link>
            </div>
          </div>

          <div className="card mt-5">
            <div className="card-header ">
              <div className=" row">
                <div className="col-md-6 col-sm-6">
                  <p className="display-4">
                    {client.firstName} {client.lastName}
                  </p>
                </div>

                <div className="col-md-6 col-sm-6">
                  <p className="text-secondary" style={{ fontSize: "12px" }}>
                    Client ID: <span>{client.id}</span>{" "}
                  </p>
                  <h4>
                    Balance:{" "}
                    <span
                      className={classnames({
                        "text-danger": client.balance > 0,
                        "text-success": client.balance === 0
                      })}
                    >
                      ${parseFloat(client.balance).toFixed(2)}
                    </span>{" "}
                    <small>
                      <a
                        href="#!"
                        onClick={() =>
                          this.setState({
                            showBalanceUpdate: !this.state.showBalanceUpdate
                          })
                        }
                      >
                        <span className="text-primary">(Edit)</span>
                      </a>
                    </small>
                  </h4>
                  {balanceForm}
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <div className="card mb-5">
                    <div className="card-header">
                      <strong>Notes</strong>{" "}
                    </div>
                    <div className="card-body">
                      <blockquote className="blockquote  ">
                        <p>{client.notes}</p>
                      </blockquote>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <strong> Email: </strong>
                      {client.email}
                      {"  "}
                    </li>
                    <li className="list-group-item">
                      <strong> Phone: </strong>
                      {client.phone}
                      {"  "}
                    </li>
                  </ul>
                </div>
              </div>
              <hr />

              <div className="container mt-4">
                <div className="row justify-content-end">
                  <div className="col-md-4">
                    <div className="btn-group float-right">
                      <Link
                        to={`/client/edit/${client.id}`}
                        className="btn btn-dark"
                      >
                        Edit Client Details
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={this.onDeleteClick}
                      >
                        <i className="far fa-trash-alt" /> Delete
                      </button>
                    </div>
                  </div>
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

ClientDetails.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    { collection: "clients", storeAs: "client", doc: props.match.params.id }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    client: ordered.client && ordered.client[0]
  }))
)(ClientDetails);
