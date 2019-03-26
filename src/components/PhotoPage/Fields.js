import React, { Component } from 'react';
import _ from "lodash";

import './style.scss';

class Fields extends Component {

  fieldsValues = this.props.fields.reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{});

  // update the field and the error state of a selected field
  handleChangeComponent = field => (value,error) => {
    this.fieldsValues[field.name].error = error
    this.fieldsValues[field.name].value = value;

    const errors = _.reduce(this.fieldsValues, (a, v) => a || v.error, false);
    this.props.handleChange(errors, this.fieldsValues);
  }


  render() {
    return (
      <div style={{marginBottom:300}}>
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
