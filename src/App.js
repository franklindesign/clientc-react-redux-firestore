import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./Helpers/Auth";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import AppNavBar from "./Components/Layout/AppNavBar";
import Dashboard from "./Components/Layout/Dashboard";

import AddClient from "./Components/Clients/AddClient";
import EditClient from "./Components/Clients/EditClient";
import ClientDetails from "./Components/Clients/ClientDetails";

import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import Settings from "./Components/Settings/Settings";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <AppNavBar />
            <div className="container">
              <Switch>
                <Route
                  exact
                  component={UserIsAuthenticated(Dashboard)}
                  path="/"
                />
                <Route
                  exact
                  component={UserIsAuthenticated(AddClient)}
                  path="/client/add"
                />
                <Route
                  exact
                  component={UserIsAuthenticated(ClientDetails)}
                  path="/client/:id"
                />
                <Route
                  exact
                  component={UserIsAuthenticated(EditClient)}
                  path="/client/edit/:id"
                />
                <Route
                  exact
                  component={UserIsNotAuthenticated(Signup)}
                  path="/signup"
                />
                <Route
                  exact
                  component={UserIsNotAuthenticated(Login)}
                  path="/login"
                />

                <Route
                  exact
                  component={UserIsAuthenticated(Settings)}
                  path="/settings"
                />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
