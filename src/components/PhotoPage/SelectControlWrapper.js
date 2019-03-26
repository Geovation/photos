import React, { Component } from 'react';
import SelectControl from './SelectControl';

class SelectControlWrapper extends Component {
  render() {
    return (
      <div style={{display:'flex',width:'100%'}}>
        <div style={{margin:15,width:'calc(100% - 30px)'}}>
          <SelectControl {...this.props} />
        </div>
      </div>
    )
  }
}

export default SelectControlWrapper;
