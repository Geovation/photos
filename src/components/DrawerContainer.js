import React, { Component } from "react";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import config from "../custom/config";
import utils from "../utils";
import "./DrawerContainer.scss";
import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "../utils";

const placeholderImage =
  process.env.PUBLIC_URL + "/images/geovation-banner.svg";
const drawerWidth = "80%";
const drawerMaxWidth = 360;

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerMaxWidth
  },
  stats: {
    position: "absolute",
    bottom: theme.spacing(5),
    alignSelf: "center",
    paddingBottom: theme.spacing(2)
  },
  links: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.spacing(1),
    fontSize: "12px"
  }
});

const PAGES = config.PAGES;
const links = {
  terms: utils.customiseString("termsAndConditions", "T&C link"),
  privacy: utils.customiseString("termsAndConditions", "Privacy Policy Link")
};

class DrawerContainer extends Component {
  render() {
    const {
      classes,
      user,
      online,
      leftDrawerOpen,
      stats,
      sponsorImage
    } = this.props;
    const ListItemsTop = [
      PAGES.account,
      PAGES.moderator,
      PAGES.feedbackReports,
      PAGES.tutorial,
      PAGES.leaderboard
    ];
    const ListItemsConfigurable = config.CUSTOM_PAGES;
    const ListItemsBottom = [
      PAGES.about,
      PAGES.writeFeedback,
      {
        visible: (user, online) => online,
        icon: <ExitToAppIcon />,
        label: user ? "Logout" : "Login",
        click: this.props.handleClickLoginLogout
      }
    ];
    const ListItems = ListItemsTop.concat(
      ListItemsConfigurable,
      ListItemsBottom
    );
    return (
      <Drawer
        className="geovation-drawercontainer"
        open={leftDrawerOpen}
        onClose={this.props.toggleLeftDrawer(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div
          style={{
            paddingTop: isIphoneWithNotchAndCordova()
              ? "env(safe-area-inset-top)"
              : isIphoneAndCordova
              ? this.props.theme.spacing(1.5)
              : null
          }}
        />
        {user && (
          <div>
            <div className="drawer-user">
              <Avatar
                alt="profile-image"
                src={user.photoURL}
                className="avatar"
                component={Link}
                to={PAGES.account.path}
                onClick={this.props.toggleLeftDrawer(false)}
              />
              <Typography className={"drawer-typography"}>
                {user.displayName}
              </Typography>
              {user.isModerator && <Typography>Admin</Typography>}
            </div>
            <Divider />
          </div>
        )}

        <div
          tabIndex={0}
          role="button"
          onClick={this.props.toggleLeftDrawer(false)}
        >
          <List>
            {ListItems.map(
              (item, index) =>
                item.visible(user, online) && (
                  <ListItem
                    key={index}
                    button
                    component={item.path && Link}
                    to={item.path}
                    onClick={item.click}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItem>
                )
            )}
          </List>
        </div>

        <Typography className={classes.stats} color={"secondary"}>
          {`${stats | 0} ${utils.customiseString(
            "drawer",
            "photos published so far!"
          )}`}
          {sponsorImage && (
            <span className="sponsored-by-container">
              <span
                className="sponsored-by-image"
                style={{ backgroundImage: "url(" + sponsorImage + ")" }}
              ></span>
            </span>
          )}
        </Typography>

        <div className="built-by-geovation">
          <Typography className="built-by-text">Built by</Typography>
          <img src={placeholderImage} className="built-by-img" alt={""} />
        </div>

        <Typography className={classes.links}>
          <a href={links.terms}>Terms and Conditions</a>
          {" / "}
          <a href={links.privacy}>Privacy Policy</a>
        </Typography>
      </Drawer>
    );
  }
}
export default withStyles(styles, { withTheme: true })(DrawerContainer);
