import React, { Component } from 'react';

import backButton from '../Images/left-arrow.svg';

import Button from '@material-ui/core/Button';

class Page3 extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
          <div style={{display:'flex',flex:1,flexDirection:'column',height:'100vh',backgroundColor:'#333'}}>
              <div style={{display:'flex',flex:1,maxHeight:50,backgroundColor:'#faa728',alignItems:'center'}}>
                  <Button
                     onClick={this.closePage}
                     color="primary"
                     style={{color:'white'}}
                   >
                      <img style={{height:25}} src={backButton} alt="backButton"/>
                  </Button>
                  <div style={{display:'flex',flex:1}}>Page 3</div>
              </div>
          </div>

    );
  }
}

export default Page3;
