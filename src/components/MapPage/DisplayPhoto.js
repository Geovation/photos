import React, { Component } from 'react';

import BackIcon from '@material-ui/icons/ArrowBack';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from '../../utils';
import CardComponent from '../CardComponent';
import dbFirebase from '../../dbFirebase';

const styles = theme => ({
  notchTop: {
    paddingTop:  isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' :
    isIphoneAndCordova ? theme.spacing(1.5) : null
  },
  iconButton: {
    marginRight: theme.spacing(2),
  },
  main: {
    marginTop: theme.spacing(2),
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  },
});

class DisplayPhoto extends Component {

  constructor(props) {
    super(props);
    this.state = {
      feature: this.props.location.state && this.props.location.state.feature
    }
  }

  formatField(value, fieldName) {
    const formater = this.props.config.PHOTO_ZOOMED_FIELDS[fieldName];
    if (value) {
      return formater(value);
    }

    return "-";
  }

  capitalize(fieldName) {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  async componentDidMount() {
    if (!this.state.feature) {
      await dbFirebase.getPhotoByID(this.props.match.params.id).then(feature => {
        this.setState({ feature });
      });
    }
  }

  render() {
    const { user, config, placeholderImage, handleClose, location, classes, fullScreen } = this.props;
    const handleRejectClick = location.state ? location.state.handleRejectClick : this.props.handleRejectClick;

    return(
      <Dialog
        fullScreen={fullScreen}
        open
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar position='static' className={classes.notchTop}>
          <Toolbar>
            <BackIcon className={classes.iconButton} onClick={handleClose} />
            <Typography variant='h6' color='inherit'>{config.PAGES.displayPhoto.label}</Typography>
          </Toolbar>
        </AppBar>
        { this.state.feature &&
          <DialogContent>
            <div style={{ textAlign: 'center' }}>
              <img onError={(e) => { e.target.src=placeholderImage}} className={'main-image'} alt={''} src={this.state.feature.properties.main}/>
            </div>
            <Card>
              <CardActionArea>
                <CardContent>
                  {Object.keys(config.PHOTO_ZOOMED_FIELDS).map(fieldName => (
                    <Typography gutterBottom key={fieldName}>
                      <b>{this.capitalize(fieldName)}: </b>
                      {this.formatField(this.state.feature.properties[fieldName], fieldName)}
                    </Typography>
                  ))}
                </CardContent>
              </CardActionArea>
              {user && user.isModerator &&
                <div>
                  <Divider/>
                  <div>
                    <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Moderator Details</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails classes={{root:classes.expansionDetails}}>
                        <CardComponent
                          photoSelected={this.state.feature.properties}
                          handleRejectClick={() => handleRejectClick(this.state.feature.properties.id)}
                        />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                </div>
              }
            </Card>
          </DialogContent>
        }
        { this.state.feature === null &&
          <h4>Error!!! No item found at the given url</h4>
        }
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(DisplayPhoto));
