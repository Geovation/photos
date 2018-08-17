import React, { Component } from 'react';

import backButton from '../Images/left-arrow.svg';

import Button from '@material-ui/core/Button';

import styles from '../Style/Page1Style.js';

class Page1 extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
          <div style={styles.wrapper}>
              <div style={styles.headline}>
                  <Button
                     onClick={this.closePage}
                     color="primary"
                   >
                      <img style={styles.buttonback} src={backButton} alt="backButton"/>
                  </Button>
                  <div style={styles.body}>Page 1</div>
              </div>
          </div>

    );
  }
}

export default Page1;
