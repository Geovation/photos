import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import config from '../../custom/config';
import './style.scss';

const styles = theme => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
});

class Fields extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{display:'flex',flexDirection:'column',flex:1,height:'100%'}}>
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
        {Object.values(config.PHOTO_FIELDS).map((field,index) => {
          return(
            <field.component
              elementId={index}
              key={index}
              handleChange={this.props.handleChange}
              classes={classes}
              field={this.props.fields[index]}
              error={this.props.errors[index]}

              type={field.type}
              title={field.title}
              placeholder={field.placeholder}
              inputProps={field.inputProps}

            />
          )
        })}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Fields);
