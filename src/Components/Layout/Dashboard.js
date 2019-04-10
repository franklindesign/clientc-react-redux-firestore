import React from "react";
import Clients from "../Clients/Clients";
import SideBar from "../Layout/SideBar";

export default function Dashboard() {
  return (
    <div className="row">
      <div className="col-md-12">
        <Clients />

        <div className="container">
          <div className="row justify-content-end">
            <SideBar />
          </div>
        </div>
      </div>
    </div>
  );
}
