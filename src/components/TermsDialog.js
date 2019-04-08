import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import config from '../custom/config';

const message = {
  title: config.customiseString('termsAndConditions', 'T&C and Privacy'),
  termsText: config.customiseString('termsAndConditions', 'Terms and Conditions'),
  termsLink: config.customiseString('termsAndConditions', 'T&C link'),
  privacyText: config.customiseString('termsAndConditions', 'Privacy Policy'),
  privacyLink: config.customiseString('termsAndConditions', 'Privacy Policy Link')
}

class TermsDialog extends React.Component {
  state = {
    open: !localStorage.getItem("TermsAccepted"),
  };

  render() {
    const { handleClose } = this.props;
     // const { fullScreen, handleClose } = this.props;

    return (
      <div>
        <Dialog
          // fullScreen={fullScreen}
          open={this.state.open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{message.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {message.termsText}
              <a href={message.termsLink}>{message.termsLink}</a>
              {message.privacyText}
              <a href={message.privacyLink}>{message.privacyLink}</a>
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

export default withMobileDialog()(TermsDialog);
