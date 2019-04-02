import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import _ from "lodash";

import './style.scss';

const styles = theme => ({
  pictureThumbnail: {
    maxWidth: 100,
    maxHeight: 100,
  }
});

class Fields extends Component {

  fieldsValues = this.props.fields.reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{});

  handleChangeComponent = field => (value,error) => {
    this.fieldsValues[field.name].error = error
    this.fieldsValues[field.name].value = value;

    const errors = _.reduce(this.fieldsValues, (a, v) => a || v.error, false);
    this.props.handleChange(errors, this.fieldsValues);
  }


  render() {
    const { classes } = this.props;
    return (
      <div style={{marginBottom:300}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
            <img src={this.props.imgSrc} alt={""} className={classes.pictureThumbnail}/>
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

export default withStyles(styles, { withTheme: true })(Fields);
