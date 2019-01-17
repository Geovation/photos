import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';
const placeholderImage = process.env.PUBLIC_URL + "/custom/images/banner.svg";

const styles = theme => ({
  root: {
    display:'flex',
    flexDirection:'column',
    flex: 1,
    height:'100%',
    position:'fixed',
    right:0,
    left:0,
    bottom:0,
    zIndex: 3
  },
  main:{
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection:'column',
    flex: 1,
    overflowY: 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  logo: {
    height: '80px',
    margin: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit * 1.5
  }
});

class PageWrapper extends React.Component {
  render() {
    const { classes, hasHeader, handleClickButton, children } = this.props;
    return (
      <Paper className={classes.root}>
        {hasHeader && <img className={classes.logo} src={placeholderImage} alt={config.customiseString('about', 'Geovation')}/>}
        <div className={classes.main}>
          {children}
        </div>
        <div className={classes.button}>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            onClick={handleClickButton}
          >
            Get Collecting
          </Button>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(PageWrapper);
