import React, { Component } from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';

class SelectControlWrapper extends Component {
  render() {
    return (
      <div style={{display:'flex',margin:15,width:'calc(100% - 30px)'}}>
          <SelectControlSingleValue {...this.props} />
      </div>
    )
  }
}

export default SelectControlWrapper;
