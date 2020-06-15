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
    const FirstField = this.props.fields[0];
    return (
      <div style={{marginBottom:300}}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <img src={this.props.imgSrc} alt={""} className={classes.pictureThumbnail}/>
          <div style={{
            width: '100%', marginLeft: this.props.theme.spacing(1.5)
          }}>
            <FirstField.component
              key={0}
              field={FirstField}
              handleChange={this.handleChangeComponent(FirstField)}
              fieldValue={this.fieldsValues[FirstField.name]}
              error={this.props.error}
            />
          </div>
        </div>
        {this.props.fields.map((field, index) => {

          // skip the first field as it is displayed beside the picture
          if (index > 0) {
            return (
              <div key={index}
                   style={{ marginTop: this.props.theme.spacing(1)}}>
                <field.component
                  field={field}
                  handleChange={this.handleChangeComponent(field)}
                  fieldValue={this.fieldsValues[field.name]}
                  error={this.props.error}
                />
              </div>
            )
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Fields);
