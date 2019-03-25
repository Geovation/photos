import React, { Component } from 'react';
import _ from "lodash";

import './style.scss';

class Fields extends Component {


  constructor(props) {
    super(props);

    this.fieldsValues = this.props.fields.reduce((a, v) => { a[v.name] = { value: v.initValue,  error: !v.initValue.match(v.regexValidation)}; return a; },{});

    debugger

    // TODO: do we need it ?
    this.state = {};
  }


  // update the field and the error state of a selected field
  handleChangeComponent = field => (value) => {
    this.fieldsValues[field.name].error = !value.match(field.regexValidation);
    this.fieldsValues[field.name].value = value;

    const errors = _.reduce(this.fieldsValues, (a, v) => a || v.error, false);
    this.props.handleChange(errors, this.fieldsValues);
  }


  render() {
    return (
      <div style={{display:'flex',flexDirection:'column',flex:1,height:'100%'}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin: '15px'
        }}>
          <div className='pictureThumnail'>
           <img src={this.props.imgSrc} alt={""}/>
          </div>
          <div style={{display: 'flex',flexDirection:'column'}}>
          </div>
        </div>
        {this.props.fields.map((field, index) => {

          return(
            <field.component
              key={index}
              field={field}
              handleChange={this.handleChangeComponent(field)}
              fieldValue={this.fieldsValues[field.name]}
            />
          )
        })}
      </div>
    );
  }
}

export default Fields;
