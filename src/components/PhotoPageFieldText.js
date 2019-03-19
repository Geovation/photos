import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class PhotoPageFieldText extends Component {
  render() {
    const {
      type,title,placeholder,inputProps,elementId,
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
          onChange={(e)=>handleChange(e,elementId)}
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
