import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { CircularProgress } from "@material-ui/core";

// import * as firebaseui from "firebaseui";
import firebase from "firebase/app";
import "firebase/auth";

import { authFirebase } from "features/firebase";
import config from "custom/config";

// TODO: change theme: https://github.com/firebase/firebaseui-web-react/tree/master/dist

class LoginFirebase extends React.Component {
  /**
   *
   * @param props are {open, handleClose  }
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      uiShown: false,
    };

    this.uiConfig = {
      // see https://github.com/firebase/firebaseui-web/issues/522#ref-issue-261600787
      // signInFlow:
      //   "matchMedia" in window &&
      //   window.matchMedia("(display-mode: standalone)").matches
      //     ? "popup"
      //     : "redirect",
      signInFlow: "popup",

      signInOptions: config.USER.SIGN_IN_OPTIONS,
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          // The users logging in with an email, need to validate the email.
          if (
            authResult.additionalUserInfo.providerId ===
              firebase.auth.EmailAuthProvider.PROVIDER_ID &&
            !authResult.user.emailVerified
          ) {
            authFirebase.sendEmailVerification();
          }
          return false;
        },
        uiShown: () => {
          this.setState({ uiShown: true });
        },
      },
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
        {!this.state.uiShown && <CircularProgress color="secondary" />}
        <DialogContent style={{ padding: "0" }}>
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
