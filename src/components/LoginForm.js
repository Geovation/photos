import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// import firebase from 'firebase/app';

// import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import TextField from "@material-ui/core/TextField";

import "firebase/auth";

class LoginForm extends React.Component {
  /**
   * DEMO OF HOW TO USE CONFIGURABLE COMPONENTS
   * @param props are {open, handleClose  }
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  handleClose = () => {
    this.props.handleClose();
    return true;
  };

  render() {
    return (
      <Dialog
        fullScreen={false}
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Login/Signup"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Insert your login and password.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Signin/Signup
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withMobileDialog()(LoginForm);
