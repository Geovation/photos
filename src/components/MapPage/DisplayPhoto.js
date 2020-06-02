import React, { Component } from "react";

import _ from "lodash";

import BackIcon from "@material-ui/icons/ArrowBack";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "../../utils";
import CardComponent from "../CardComponent";

const tweetLogo = process.env.PUBLIC_URL + "/images/twitter.svg";

const styles = theme => ({
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-top)"
      : isIphoneAndCordova
      ? theme.spacing(1.5)
      : null
  },
  iconButton: {
    marginRight: theme.spacing(2)
  },
  main: {
    marginTop: theme.spacing(2)
  },
  tweetLogo: {
    padding: theme.spacing(1.6)
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-bottom)"
      : 0
  }
});

class DisplayPhoto extends Component {
  formatField(value, fieldName) {
    const formater = this.props.config.PHOTO_ZOOMED_FIELDS[fieldName];
    if (value) {
      return formater(value);
    }

    return "-";
  }

  render() {
    const {
      user,
      config,
      placeholderImage,
      feature,
      handleClose,
      handleRejectClick,
      handleApproveClick,
      classes,
      fullScreen,
      location
    } = this.props;

    const photoID = _.get(feature, "properties.id", "");
    const coords = location.pathname.split("@")[1];
    const photoUrl = `${config.metadata.metadataServerUrl}/${photoID}@${coords}`;
    const photoTweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      config.CUSTOM_STRING.tweetMessage
    )}&url=${encodeURIComponent(photoUrl)}`;

    return (
      <div>
        {typeof feature === "undefined" ? (
          <Dialog
            open
            PaperProps={{
              style: { backgroundColor: "transparent", boxShadow: "none" }
            }}
          >
            <CircularProgress color="secondary" />
          </Dialog>
        ) : (
          <Dialog
            fullScreen={fullScreen}
            open
            aria-labelledby="responsive-dialog-title"
          >
            <AppBar position="static" className={classes.notchTop}>
              <Toolbar>
                <BackIcon
                  className={classes.iconButton}
                  onClick={handleClose}
                />
                <Typography variant="h6" color="inherit">
                  {config.PAGES.displayPhoto.label}
                </Typography>
              </Toolbar>
            </AppBar>

            <DialogContent>
              <div style={{ textAlign: "center" }}>
                <img
                  onError={e => {
                    e.target.src = placeholderImage;
                  }}
                  className={"main-image"}
                  alt={""}
                  src={(feature && feature.properties.main) || placeholderImage}
                />
              </div>
              {feature === null ? (
                <h3>Error!!! No item found at the given url</h3>
              ) : (
                <Card>
                  <div style={{ display: "flex" }}>
                    <CardActionArea>
                      <CardContent>
                        {Object.keys(config.PHOTO_ZOOMED_FIELDS).map(
                          fieldName => (
                            <Typography gutterBottom key={fieldName}>
                              <b>{_.capitalize(fieldName)}: </b>
                              {this.formatField(
                                feature.properties[fieldName],
                                fieldName
                              )}
                            </Typography>
                          )
                        )}
                      </CardContent>
                    </CardActionArea>
                    <a
                      className={classes.tweetLogo}
                      href={photoTweetLink}
                      target="blank"
                    >
                      <img src={tweetLogo} alt="tweet" />
                    </a>
                  </div>
                  {user && user.isModerator && (
                    <div>
                      <Divider />
                      <div>
                        <ExpansionPanel>
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                          >
                            <Typography className={classes.heading}>
                              Moderator Details
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails
                            classes={{ root: classes.expansionDetails }}
                          >
                            <CardComponent
                              photoSelected={feature.properties}
                              handleRejectClick={() =>
                                handleRejectClick(feature.properties)
                              }
                              handleApproveClick={() =>
                                handleApproveClick(feature.properties)
                              }
                            />
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(DisplayPhoto));
