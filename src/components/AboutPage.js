import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';
const placeholderImage = process.env.PUBLIC_URL + "/custom/images/banner.svg";

const styles = theme => ({
  root: {
    // ...theme.mixins.gutters(),
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2,
    display:'flex',
    flexDirection:'column',
    flex: 1,
    height:'100%',
  },
  typography : {
    ...theme.mixins.gutters(),
    display: 'flex',
    flex: 1,
    whiteSpace: 'pre-wrap',
    overflowY: 'auto',
    marginBottom: theme.spacing.unit
  },
  logo: {
    height: '80px',
    margin: theme.spacing.unit * 2,
    // marginTop: theme.spacing.unit * 2,
    // marginBottom: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit * 1.5
  }
});

class AboutPage extends React.Component {

  handleClickButton = () => {
    this.props.goToPage(config.PAGES.map); // go to the map
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <img className={classes.logo} src={placeholderImage} alt={config.customiseString('about', 'Geovation')}/>
        <Typography align={'justify'} variant={'subtitle1'} className={classes.typography}>
          {config.customiseString('about', 'We are Geovation and we Geovate')}
          <br /><br /><br />
          Version {process.env.REACT_APP_VERSION}, build {process.env.REACT_APP_BUILD_NUMBER}
        </Typography>
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

export default withStyles(styles)(AboutPage);
