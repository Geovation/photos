import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';

const message = {
  title: config.customiseString('termsAndConditions', 'T&C and Privacy'),
  startText: config.customiseString('termsAndConditions', 'Please read and agree to '),
  termsText: config.customiseString('termsAndConditions', 'Terms and Conditions'),
  midText: config.customiseString('termsAndConditions', ' and '),
  privacyText: config.customiseString('termsAndConditions', 'Privacy Policy'),
  termsLink: config.customiseString('termsAndConditions', 'T&C link'),
  privacyLink: config.customiseString('termsAndConditions', 'Privacy Policy Link')
}

const styles = theme => ({
  root: {
    background:'rgba(255,225,225,0.5)'
  }
});

class TermsDialog extends React.Component {
  state = {
    open: !localStorage.getItem("TermsAccepted"),
  };

  render() {
    const { fullScreen, handleClose, classes } = this.props;

    return (
      <div>
        <Dialog
          // fullScreen={fullScreen}
          classes={{container: classes.root}}
          open={this.state.open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{message.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {message.startText}
              <a href={message.termsLink}>{message.termsText}</a>
              {message.midText}
              <a href={message.privacyLink}>{message.privacyText}</a>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              onClick={handleClose}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

TermsDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles)(TermsDialog));
