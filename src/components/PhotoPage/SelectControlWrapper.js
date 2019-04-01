import React, { Component } from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';

class SelectControlWrapper extends Component {
  handleChangeSelect = (value) => {
    const name = this.props.field.name
    this.props.handleChange(value,false);
  }

  render() {
    return (
      <div style={{display:'flex',margin:15,width:'calc(100% - 30px)'}}>
          <SelectControlSingleValue handleChangeSelect={this.handleChangeSelect} {...this.props} />
      </div>
    )
  }
}

export default SelectControlWrapper;
