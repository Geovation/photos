import React from 'react';

import placeholderImage from '../custom/images/geovation_logo.svg';
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

const tutorialSteps = {
  'camera':{
    step:1,
    photo:<CameraAlt/>,
    text:'Walk around the city and take photos'
  },
  'upload':{
    step:2,
    photo:<CloudUpload/>,
    text:'Write info about the photos and upload it to the cloud'
  },
  'location':{
    step:3,
    photo:<LocationOn/>,
    text:'View your images in our interactive map'
  }
};

class TutorialPage extends React.Component {
  render() {
    return (
      <div style={{backgroundColor:''}} className={'geovation-tutorial'}>
        <img className={'logo'} src={placeholderImage} alt=''/>
        <List dense className={'list'}>
          { Object.values(tutorialSteps).map(value => (
            <div key={value.step}>
              <ListItem className={'listItem'}>
                <ListItemIcon>{value.photo}</ListItemIcon>
                <ListItemText
                  primary={<div className={'title'}>Step {value.step}</div>}
                  secondary={value.text} />
              </ListItem>
              <Divider className={'divider'}/>
            </div>
          ))}
        </List>
        <Button className={'button'} variant="contained" color='primary'>Get Collecting</Button>
      </div>
    );
  }
}

export default TutorialPage;
