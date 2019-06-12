import React from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LocationOn from '@material-ui/icons/LocationOn';
import CameraAlt from '@material-ui/icons/CameraAlt';
import CloudUpload from '@material-ui/icons/CloudUpload';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import './TutorialPage.scss';
import utils, { isIphoneWithNotchAndCordova } from '../utils';
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
    zIndex: theme.zIndex.appBar
  },
  main:{
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection:'column',
    flex: 1,
    overflowY: 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  logo: {
    height: '80px',
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1.5),
  },
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' : 0
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  }
});

const tutorialSteps = {
  'camera': {
    photo: <CameraAlt />,
    text: utils.customiseString('tutorial', 'Walk around the city and take photos')
  },
  'upload': {
    photo: <CloudUpload />,
    text: utils.customiseString('tutorial', 'Write info about the photos and upload it to the cloud')
  },
  'location': {
    photo: <LocationOn />,
    text: utils.customiseString('tutorial', 'View your images in our interactive map')
  }
};

class WelcomePage extends React.Component {
  render() {
    const { classes, handleClose } = this.props;
    return (
      <Paper elevation={2} className={classes.root}>
        <div className={classes.notchTop}/>
        <img className={classes.logo} src={placeholderImage} alt={utils.customiseString('about', 'Geovation')}/>
        <div className={classes.main}>
          <List dense className={'list'}>
            { Object.values(tutorialSteps).map((value, index) => (
              <div key={index}>
                <ListItem className={'listItem'}>
                  <ListItemIcon>{value.photo}</ListItemIcon>
                  <ListItemText
                    primary={<div className={'title'}>Step {index + 1}</div>}
                    secondary={value.text} />
                </ListItem>
                <Divider variant='inset' />
              </div>
            ))}
          </List>
        </div>
        <div className={classes.button}>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            onClick={handleClose}
          >
            Get Collecting
          </Button>
        </div>
        <div className={classes.notchBottom}/>
      </Paper>
    );
  }
}

export default withStyles(styles)(WelcomePage);
