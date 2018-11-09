import React from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog'

import {firebaseApp} from './firebaseInit.js';
import firebase from 'firebase/app';

import 'firebase/auth';

class LoginFirebase extends StyledFirebaseAuth {

  /**
   *
   * @param props are {open, handleClose  }
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  componentDidMount() {
    this.uiConfig = {
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ]
    };
  }

  handleClose = () => {
    this.props.handleClose();
    return true;
  };

  render() {
    return (
      <Dialog
        fullScreen={true}
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Login/Signup"}</DialogTitle>
        <DialogContent>
          <StyledFirebaseAuth
            // uiCallback={ui => ui.disableAutoSignIn()}
            uiConfig={this.uiConfig}
            firebaseAuth={firebaseApp.auth()}
          />
        </DialogContent>
      </Dialog>

    );
  }
}

export default withMobileDialog()(LoginFirebase);
