import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class PhotoPageFieldText extends React.Component {
  render() {
    const {
      type,title,placeholder,inputProps,
      classes,field,error,handleChange,
    } = this.props;
    return (
      <div className='text-field-wrapper'>
        <Typography className='typography1'>
          {title}
        </Typography>

        <TextField
          id="standard-name"
          type={type}
          required={true}
          placeholder={placeholder}
          className='text-field'
          value={field}
          onChange={handleChange}
          error= {error}
          InputProps={Object.assign({
            className: classes.cssUnderline
          }, inputProps)}
        />
      </div>
    )
  }
}

export default PhotoPageFieldText;
