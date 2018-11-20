import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import backButton from '../../images/left-arrow.svg';
import './EverybodyPage.scss';

class EverybodyPage extends Component {

  render() {
    return (
      <div className='geovation-everybodyPage '>
        <div className='headline'>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <Button>
              <img className='buttonback' src={backButton} alt=''/>
            </Button>
          </Link>
          <div className='headtext'>Page for Everybody </div>
        </div>
      </div>
    );
  }
}

export default EverybodyPage;
