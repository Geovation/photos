import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";

import "./Dialogs.scss";

const Dialogs = ({
  alertOpen,
  alertMessage,
  closeAlert,
  sending,
  sendingProgress,
  handleCancelSend
}) => (
  <>
    <Dialog
      open={alertOpen}
      onClose={closeAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {alertMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAlert} color="secondary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={sending}>
      <DialogContent className={"dialogs__contentProgress"}>
        <DialogContentText id="loading-dialog-text">
          {sendingProgress} % done. Be patient ;)
        </DialogContentText>
        <div className={"dialogs__linearProgress"}>
          <br />
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={sendingProgress}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelSend} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

export default Dialogs;
