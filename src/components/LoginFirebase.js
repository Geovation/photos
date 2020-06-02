import React from "react";
import FirebaseAuth from "react-firebaseui/FirebaseAuth";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import * as firebaseui from "firebaseui";
import firebase from "firebase/app";
import "firebase/auth";

import { authFirebase } from "features/firebase";

// TODO: change theme: https://github.com/firebase/firebaseui-web-react/tree/master/dist

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
      // signInFlow: 'redirect',
      signInSuccessUrl: "/",
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: authResult => {
          if (authResult.additionalUserInfo.isNewUser) {
            authFirebase.sendEmailVerification();
          }
          return false;
        }
      }
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
          <FirebaseAuth
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
