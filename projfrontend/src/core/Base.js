import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "My description",
  className = "bg-dark text-white p-4",
  children,
}) => (
  <div>
    <Menu />
    <div className="container-fluid">
      <div className="jumbotron bg-dark text-white text-center py-3">
        <h2 className="display-4">{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
    <footer className="footer bg-dark mt-5 py-3">
      <div className="container-fluid bg-success">
        <div className="text-white text-center">
          <h4>If you have any queries, feel free to reach out</h4>
          <button className="btn btn-warning btn-lg">Contact Us</button>
          <br />
        </div>
        <span className="text-dark">
          An amazing store for <span className="text-white">Cameras</span> and
          accessories
        </span>
      </div>
    </footer>
  </div>
);

export default Base;
