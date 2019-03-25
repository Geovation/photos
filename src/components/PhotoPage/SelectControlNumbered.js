// Profile page to display user details.

import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SelectControl from './SelectControl';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
});

class SelectControlNumbered extends React.Component {

  state = {
    TextFieldValue:'',
  }

  combinedValue = {}

  // TODO: manager ERROR

  textFieldHandleChange = (e) => {
    this.setState({TextFieldValue:e.target.value})

    const formatedValue = Number(e.target.value);
    const error = !e.target.value.match(this.props.field.regexValidation);

    this.combinedValue.number = formatedValue;
    this.props.handleChange(this.combinedValue,error);
  }

  selectControlHandleChange = (formatedValue) => {

    const error = !this.state.TextFieldValue.match(this.props.field.regexValidation);

    this.combinedValue.leafKey = formatedValue;
    this.props.handleChange(this.combinedValue,error);
  }

  render() {
    const { field, classes } = this.props;
    const props = {...this.props};
    props.handleChange = this.selectControlHandleChange;

    return (
      <div style={{display:'flex',margin: 15,width:'calc(100% - 30px)'}}>
        <SelectControl {...props}/>
        <div style={{display:'flex',alignItems:'flex-end',width:30,marginLeft:5}}>
          <TextField
            type={field.type}

            onChange={this.textFieldHandleChange}
            value={this.state.TextFieldValue}
            error= {!this.state.TextFieldValue.match(field.regexValidation)}
            required={true}
            className='text-field'
            InputProps={Object.assign({
              className: classes.cssUnderline
            }, field.inputProps)}

          />
        </div>
      </div>
    );
  }
}

// // TODO
// Profile.propTypes = {
//   user: PropTypes.object
// };

export default withStyles(styles)(SelectControlNumbered);
