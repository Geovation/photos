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
    selectValue:null
  }

  combinedValue = {};

  textFieldHandleChange = (e) => {
    const value = e.target.value;
    const error = this.state.selectValue ? !value.match('^[0-9]+') : false;
    const formatedValue = Number(e.target.value);

    this.setState({ TextFieldValue : value });

    this.combinedValue.number = formatedValue;
    this.props.handleChange(this.combinedValue,error);
  }

  selectControlHandleChange = (value) => {
    this.setState({ selectValue : value });
    const error = value ? !this.state.TextFieldValue.match('^[0-9]+') : false;

    this.combinedValue.leafKey = value;
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
            error= {this.state.selectValue ? !this.state.TextFieldValue.match('^[0-9]+') : false}
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
