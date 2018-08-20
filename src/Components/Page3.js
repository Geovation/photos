import React, { Component } from 'react';

import backButton from '../Images/left-arrow.svg';

import Button from '@material-ui/core/Button';

import styles from '../Style/Page1Style.js';

class Page3 extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.headline}>
          <Button onClick={this.closePage}>
            <img style={styles.buttonback} src={backButton} alt='backButton'/>
          </Button>
          <div style={styles.headtext}>Page 3</div>
        </div>
      </div>
    );
  }
}

export default Page3;
