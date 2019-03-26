import React, { Component } from 'react';
import SelectControl from './SelectControl';

class SelectControlWrapper extends Component {
  render() {
    return (
      <div style={{display:'flex',margin:15,width:'calc(100% - 30px)'}}>
          <SelectControl {...this.props} />
      </div>
    )
  }
}

export default SelectControlWrapper;
