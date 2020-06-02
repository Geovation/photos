import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
// import backButton from '../images/left-arrow.svg';
import "./AnonymousPage.scss";

class AnonymousPage extends Component {
  render() {
    return (
      <div className="geovation-page1">
        <div className="headline">
          <Link to="/" style={{ textDecoration: "none", display: "block" }}>
            <Button>
              {/*<img className='buttonback' src={backButton} alt=''/>*/}
            </Button>
          </Link>

          <div className="headtext">Page for Anonymous </div>
        </div>
      </div>
    );
  }
}

export default AnonymousPage;
