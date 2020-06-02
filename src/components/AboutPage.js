import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CachedIcon from "@material-ui/icons/Cached";
import { withStyles } from "@material-ui/core/styles";

import PageWrapper from "./PageWrapper";
import utils from "../utils";

const styles = theme => ({
  typography: {
    ...theme.mixins.gutters(),
    whiteSpace: "pre-wrap"
  }
});

class AboutPage extends React.Component {
  render() {
    const { classes, label, reloadPhotos } = this.props;
    return (
      <PageWrapper
        label={label}
        handleClose={this.props.handleClose}
        hasLogo={true}
      >
        <Typography
          align={"justify"}
          variant={"subtitle1"}
          className={classes.typography}
        >
          {utils.customiseString("about", "We are Geovation and we Geovate")}
          <br />
          <span style={{ display: "block", textAlign: "center" }}>
            <Button
              onClick={reloadPhotos}
              color="secondary"
              startIcon={<CachedIcon />}
            >
              Recache Photos
            </Button>
          </span>
          <br />
          Version {process.env.REACT_APP_VERSION}, build{" "}
          {process.env.REACT_APP_BUILD_NUMBER}
        </Typography>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(AboutPage);
