import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import BackIcon from "@material-ui/icons/ArrowBack";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { dbFirebase } from "features/firebase";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "../../utils";
import config from "../../custom/config";

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
  button: {
    margin: theme.spacing(1.5)
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-bottom)"
      : 0
  }
});

const page = config.PAGES.feedbackDetails;

class FeedbackDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: this.props.location.state && this.props.location.state.feedback
    };
  }

  handleResolvedClick = async (feedback, user) => {
    await dbFirebase.toggleUnreadFeedback(
      feedback.id,
      feedback.resolved,
      user.id
    );
  };

  readFeedbacksIfNecessary() {
    if (
      !this.state.feedback &&
      this.props.user &&
      this.props.user.isModerator
    ) {
      dbFirebase.getFeedbackByID(this.props.match.params.id).then(feedback => {
        this.setState({ feedback });
      });
    }
  }

  componentDidMount() {
    this.readFeedbacksIfNecessary();
  }

  componentDidUpdate() {
    this.readFeedbacksIfNecessary();
  }

  render() {
    const { classes, fullScreen, handleClose, user } = this.props;
    const feedback = this.state.feedback;

    return (
      <Dialog
        fullScreen={fullScreen}
        open
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar position="static" className={classes.notchTop}>
          <Toolbar>
            <BackIcon className={classes.iconButton} onClick={handleClose} />
            <Typography variant="h6" color="inherit">
              {page.label}
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent className={classes.main}>
          {feedback ? (
            Object.keys(feedback).map(key => (
              <div key={key} style={{ textAlign: "justify", padding: "5px" }}>
                <b>{key + ": "}</b>
                {"" +
                  (feedback[key].toDate
                    ? feedback[key].toDate()
                    : feedback[key])}
              </div>
            ))
          ) : (
            <Dialog
              open
              PaperProps={{
                style: { backgroundColor: "transparent", boxShadow: "none" }
              }}
            >
              <CircularProgress color="secondary" />
            </Dialog>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            disabled={!feedback}
            className={classes.button}
            fullWidth
            variant="contained"
            color="secondary"
            onClick={async () => {
              await this.handleResolvedClick(feedback, user);
              handleClose();
            }}
          >
            {feedback && feedback.resolved ? "Unsolved" : "Resolved"}
          </Button>
        </DialogActions>
        <div className={classes.notchBottom} />
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(FeedbackDetailsPage));
