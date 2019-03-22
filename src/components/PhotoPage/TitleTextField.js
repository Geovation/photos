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
    const {
      type,title,placeholder,inputProps,titleTextId,
      classes,field,error,handleChange,
    } = this.props;
    return (
      <div className='text-field-wrapper'>
        <Typography className='typography1'>
          {title}
        </Typography>

        <TextField
          id={'textfield' + title}
          type={type}
          required={true}
          placeholder={placeholder}
          className='text-field'
          value={field}
          onChange={(e)=>handleChange(e.target.value)}
          error= {error}
          InputProps={Object.assign({
            className: classes.cssUnderline
          }, inputProps)}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TitleTextField);

