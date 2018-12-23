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
  },
  main:{
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection:'column',
    flex: 1,
    overflowY: 'auto',
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

  handleClickButton = () => {
    // To control if click the button from tutorial page or welcome page
    if (this.props.pathname === config.PAGES.map.path) {
      this.props.handleWelcomePageClose();
    }
    this.props.goToPage(config.PAGES.map);
  };

  render() {
    const { classes, header } = this.props;
    return (
      <Paper className={classes.root}>
        {header && <img className={classes.logo} src={placeholderImage} alt={config.customiseString('about', 'Geovation')}/>}
        <div className={classes.main}>
          {this.props.children}
        </div>
        <div className={classes.button}>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            onClick={this.handleClickButton}
          >
            Get Collecting
          </Button>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(PageWrapper);
