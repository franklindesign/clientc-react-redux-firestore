import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import classnames from "classnames";

import Spinner from "../Layout/Spinner";

class Clients extends Component {
  state = { totalOwed: null };

  static getDerivedStateFromProps(props, state) {
    const { clients } = props;

    if (clients) {
      const total = clients.reduce((total, client) => {
        return total + parseFloat(client.balance.toString());
      }, 0);
      return { totalOwed: total };
    }
    return null;
  }

  render() {
    const { clients } = this.props;

    const { totalOwed } = this.state;

    if (clients) {
      return (
        <div>
          <div className="row">
            <div className="col-6">
              <h1 className="display-4 text-white mt-3">Clients</h1>
            </div>
            <div className="text-right col-6 mt-3">
              <h5 className="text-white">Total Owed:</h5>
              <h3 className="text-white">
                {" "}
                $
                {parseFloat(totalOwed)
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </h3>
            </div>
            <table
              className="table bg-white mt-2 table-hover "
              style={{ borderRadius: "0px 0px 20px 20px" }}
            >
              <thead className="thead-inverse">
                <tr>
                  <th>Name</th>

                  <th>Balance</th>
                  <th>Notes</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td>
                      {client.firstName} {client.lastName}
                    </td>

                    <td
                      className={classnames({
                        "text-danger": client.balance > 0,
                        "text-success": client.balance === 0.0
                      })}
                    >
                      $
                      {parseFloat(client.balance)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td>{client.notes}</td>
                    <td>
                      <Link
                        to={`/client/${client.id}`}
                        className="btn btn-white btn-sm"
                      >
                        Client Info
                        <i className="fas fa-arrow-circle-right ml-2" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

Clients.propTypes = {
  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array
};

export default compose(
  firestoreConnect([{ collection: "clients" }]),
  connect((state, props) => ({ clients: state.firestore.ordered.clients }))
)(Clients);
