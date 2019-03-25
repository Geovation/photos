import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
});
class TitleTextField extends Component {
  render() {
    // TODO: proptypes
    const { field, handleChange, classes } = this.props;
    return (
      <div className='text-field-wrapper'>
        <Typography className='typography1'>
          {field.title}
        </Typography>

        <TextField
          // id={'textfield' + title}
          type={field.type}
          required={true}
          placeholder={field.placeholder}
          className='text-field'
          value={field.value}
          onChange={(e)=>handleChange(e.target.value)}
          error= {field.error}
          InputProps={Object.assign({
            className: classes.cssUnderline
          }, field.inputProps)}
      />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TitleTextField);

