import React from 'react';

import placeholderImage from '../custom/images/banner.svg';
import LocationOn from '@material-ui/icons/LocationOn';
import CameraAlt from '@material-ui/icons/CameraAlt';
import CloudUpload from '@material-ui/icons/CloudUpload';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import './TutorialPage.scss';

import config from '../custom/config';

const tutorialSteps = {
  'camera': {
    photo: <CameraAlt />,
    text: config.customiseString("tutorial", "Walk around the city and take photos")
  },
  'upload': {
    photo: <CloudUpload />,
    text: config.customiseString("tutorial", "Write info about the photos and upload it to the cloud")
  },
  'location': {
    photo: <LocationOn />,
    text: config.customiseString("tutorial", "View your images in our interactive map")
  }
};

class TutorialPage extends React.Component {

  handleClickButton = () => {
    // To control if click the button from tutorial page or welcome page
    if (this.props.location.pathname === config.PAGES.tutorial.path) {
      this.props.goToPage(config.PAGES.map); // go to the map
    } else {
      this.props.handleWelcomePageClose(); // close the welcome page
    }
  };

  render() {
    return (
      <div className={'geovation-tutorial'}>
        <img className={'logo'} src={placeholderImage} alt='geovation'/>
        <List dense className={'list'}>
          { Object.values(tutorialSteps).map((value, index) => (
            <div key={index}>
              <ListItem className={'listItem'}>
                <ListItemIcon>{value.photo}</ListItemIcon>
                <ListItemText
                  primary={<div className={'title'}>Step {index + 1}</div>}
                  secondary={value.text} />
              </ListItem>
              <Divider className={'divider'}/>
            </div>
          ))}
        </List>
        <div className='button'>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            onClick={this.handleClickButton}
          >
            Get Collecting
          </Button>
        </div>
      </div>
    );
  }
}

export default TutorialPage;
