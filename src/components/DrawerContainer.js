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
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import config from '../custom/config';
import './DrawerContainer.scss';

import placeholderImage from '../custom/images/banner.svg';

const drawerWidth = '80%';
const drawerMaxWidth = 360;

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerMaxWidth,
  }
});

class DrawerContainer extends Component {
  render() {
    const { classes, user, online, leftDrawerOpen } = this.props;
    const PAGES = config.PAGES;

    return (
      <Drawer className='geovation-drawercontainer' open={leftDrawerOpen} onClose={this.props.toggleLeftDrawer(false)}
        classes={{ paper: classes.drawerPaper }}>
        <div
          tabIndex={0}
          role='button'
          onClick={this.props.toggleLeftDrawer(false)}
          onKeyDown={this.props.toggleLeftDrawer(false)}
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
            { user &&
              <ListItem button>
                <Link className='link' to={PAGES.account.path}>
                  <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                  <ListItemText primary={PAGES.account.label} />
                </Link>
              </ListItem>
            }

            { user && user.isModerator &&
              <ListItem button>
                <Link className='link' to={PAGES.moderator.path}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary={PAGES.moderator.label} />
                </Link>
              </ListItem>
            }

            <ListItem button>
              <Link className='link' to={PAGES.tutorial.path}>
                <ListItemIcon><SchoolIcon/></ListItemIcon>
                <ListItemText primary={PAGES.tutorial.label} />
              </Link>
            </ListItem>
            <ListItem button>
              <Link className='link' to={PAGES.about.path}>
                <ListItemIcon><HelpIcon/></ListItemIcon>
                <ListItemText primary={PAGES.about.label} />
              </Link>
            </ListItem>

            { online &&
              <ListItem button onClick={this.props.handleClickLoginLogout}>
                <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                <ListItemText primary={user ?'Logout':'Login'} />
              </ListItem>
            }
          </List>
        </div>
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
