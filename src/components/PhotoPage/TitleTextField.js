import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import enums from '../../types/enums';

const styles = theme => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
});
class TitleTextField extends Component {

  dataFormater = value =>{
    return this.props.field.type === enums.TYPES.number ? Number(value) : String(value);
  }

  onChangeHandler = (e) => {
    const valueFormated = this.dataFormater(e.target.value);
    const error = !e.target.value.match(this.props.field.regexValidation);

    this.props.handleChange(valueFormated,error);
  }

  render() {
    // TODO: proptypes
    const { field, fieldValue, classes } = this.props;
    return (
        <TextField
          InputLabelProps= {{
            shrink: true,
            style: { color: '#000' },
          }}
          label={field.title}
          fullWidth
          id={'textfield' + field.title}
          type={field.type}
          required={true}
          placeholder={field.placeholder}
          className='text-field'
          value={fieldValue.value}
          onChange={this.onChangeHandler}
          error= {fieldValue.error}
          InputProps={Object.assign({
            className: classes.cssUnderline
          }, field.inputProps)}
        />
    )
  }
}

export default withStyles(styles, { withTheme: true })(TitleTextField);
