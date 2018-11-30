import React from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import withMobileDialog from '@material-ui/core/withMobileDialog'
import * as firebaseui from 'firebaseui';

import firebase from 'firebase/app';

import 'firebase/auth';

class LoginFirebase extends React.Component {

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
      // signInFlow: 'popup',
      signInSuccessUrl: '/',
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      // callbacks: {
      //   // Avoid redirects after sign-in.
      //   signInSuccessWithAuthResult: () => false
      // }
    };
  }

  handleClose = () => {
    this.props.handleClose();
    return true;
  };

  render() {
    return (
      <Dialog
        // style={{ padding: '0px 0px 0px 0px' }}
        // fullScreen={false}
        // fullWidth={true}
        open={this.props.open}
        onClose={this.handleClose}
        // aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <StyledFirebaseAuth
            // uiCallback={ui => ui.disableAutoSignIn()}
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default withMobileDialog()(LoginFirebase);
