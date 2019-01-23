import React, { Component } from 'react';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HelpIcon from '@material-ui/icons/Help';
import SchoolIcon from '@material-ui/icons/School';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import config from '../custom/config';
import './DrawerContainer.scss';
import { isIphoneWithNotchAndCordova } from '../utils';

const placeholderImage = process.env.PUBLIC_URL + "/images/geovation-banner.svg";
const drawerWidth = '80%';
const drawerMaxWidth = 360;

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerMaxWidth,
  },
  stats: {
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
    alignSelf: 'center',
    paddingBottom: theme.spacing.unit * 2
  }
});

const PAGES = config.PAGES;

class DrawerContainer extends Component {

  render() {
    const { classes, user, online, leftDrawerOpen, stats } = this.props;
    const ListItemsTop = [
      {
        visible: user,
        path: PAGES.account.path,
        icon: <AccountCircleIcon/>,
        label: PAGES.account.label
      },
      {
        visible: user && user.isModerator,
        path: PAGES.moderator.path,
        icon: <CheckCircleIcon/>,
        label: PAGES.moderator.label
      },
      {
        visible: true,
        path: PAGES.tutorial.path,
        icon: <SchoolIcon/>,
        label: PAGES.tutorial.label
      },
    ];
    const ListItemsConfigurable = config.CUSTOM_PAGES;
    const ListItemsBottom = [
      {
        visible: true,
        path: PAGES.about.path,
        icon: <HelpIcon/>,
        label: PAGES.about.label
      },
      {
         visible: true,
         path: PAGES.writeFeedback.path,
         icon: <FeedbackIcon/>,
         label: PAGES.writeFeedback.label
      },
      {
        visible: online,
        icon: <ExitToAppIcon/>,
        label: user ? 'Logout' : 'Login',
        click: this.props.handleClickLoginLogout
      }
    ];
    const ListItems = ListItemsTop.concat(ListItemsConfigurable,ListItemsBottom)
    return (
      <Drawer className='geovation-drawercontainer' open={leftDrawerOpen} onClose={this.props.toggleLeftDrawer(false)}
        classes={{ paper: classes.drawerPaper }}>
        <div
          tabIndex={0}
          role='button'
          onClick={this.props.toggleLeftDrawer(false)}
          onKeyDown={this.props.toggleLeftDrawer(false)}
          style={{ paddingTop: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' : 0 }}
        >
          { user &&
            <div>
              <div className='drawer-user'>
                <Avatar alt='profile-image' src={user.photoURL} className='avatar' />
                <Typography className={'drawer-typography'}>{user.displayName}</Typography>
                {user.isModerator && <Typography>Admin</Typography>}
              </div>
              <Divider/>
            </div>
          }
          <List>
            {ListItems.map( (item,index) => item.visible &&
              <ListItem key={index} button component={item.path && Link} to={item.path} onClick={item.click}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            )}
          </List>
        </div>
        <Typography className={classes.stats} color={'secondary'}>
          {`${stats | 0} ${config.customiseString('drawer', 'photos published so far!')}`}
        </Typography>
        <div className='built-by-geovation'>
          <Typography className='built-by-text'>
            Built by
          </Typography>
          <img src={placeholderImage} className='built-by-img' alt={''} />
        </div>
      </Drawer>
    );
  }
}
export default withStyles(styles)(DrawerContainer);
