import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import backButton from '../Images/left-arrow.svg';
import styles from '../Style/Page1Style';

class Page2 extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.headline}>
          <Button onClick={this.closePage}>
            <img style={styles.buttonback} src={backButton} alt=''/>
          </Button>
          <div style={styles.headtext}>Page 2</div>
        </div>
      </div>
    );
  }
}

export default Page2;
