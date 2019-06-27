import React, { Component } from 'react';

import _ from 'lodash';

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
import CircularProgress from '@material-ui/core/CircularProgress';

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

  async componentDidMount() {
    // TODO: remove this hack. Just need to decouple Firebase from this UI component
    if (!this.state.feature) {
      try {
        await dbFirebase.getPhotoByID(this.props.match.params.id).then(feature => {
          this.setState({feature});
        });
      }
      catch (e) {
        console.log(e)
        this.setState({feature: null});
      }
    }
  }

  render() {
    const { user, config, placeholderImage, handleClose, handleRejectClick, handleApproveClick, classes, fullScreen } = this.props;

    console.log(this.state.feature)

    const feature = {
      properties: {
        main: ""
      },
      ...this.state.feature
    }

    return(
      <div>
        { typeof this.state.feature === 'undefined' ?
          <Dialog open PaperProps={{style: {backgroundColor: 'transparent', boxShadow: 'none'}}}>
            <CircularProgress color='secondary'/>
          </Dialog>
        :
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

            <DialogContent>
              <div style={{ textAlign: 'center' }}>
                <img onError={(e) => { e.target.src=placeholderImage}} className={'main-image'} alt={''} src={feature.properties.main}/>
              </div>
              { this.state.feature === null ?
                <h3>Error!!! No item found at the given url</h3>
              :
                <Card>
                  <CardActionArea>
                    <CardContent>
                      {Object.keys(config.PHOTO_ZOOMED_FIELDS).map(fieldName => (
                        <Typography gutterBottom key={fieldName}>
                          <b>{_.capitalize(fieldName)}: </b>
                          {this.formatField(feature.properties[fieldName], fieldName)}
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
                              photoSelected={feature.properties}
                              handleRejectClick={() => handleRejectClick(feature.properties.id)}
                              handleApproveClick={() => handleApproveClick(feature.properties.id)}
                            />
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </div>
                    </div>
                  }
                </Card>
              }
            </DialogContent>
          </Dialog>
        }
    </div>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(DisplayPhoto));
