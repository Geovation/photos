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

import md5 from 'md5';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import './DrawerContainer.scss';

const drawerWidth = '80%';
const drawerMaxWidth = 360;

const styles = theme => ({
  root:{
    zIndex: 1402 //hack to surpass snackbar
  },
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerMaxWidth,
  }
});

class DrawerContainer extends Component {
  render() {
    const { classes, user, pages, online, leftDrawerOpen } = this.props;
    let gravatarImg
    if (user) {
      gravatarImg = 'https://www.gravatar.com/avatar/' + md5(user.email);
    }
    return (
      <Drawer open={leftDrawerOpen} onClose={this.props.toggleLeftDrawer(false)}
        classes={{ paper: classes.drawerPaper, root: classes.root}}>
        <div
          tabIndex={0}
          role='button'
          onClick={this.props.toggleLeftDrawer(false)}
          onKeyDown={this.props.toggleLeftDrawer(false)}
        >
          { user &&
            <div>
              <div className='drawer-user'>
                <Avatar alt='profile-image' src={gravatarImg} className='avatar' />
                <Typography variant='h5'>{user.displayName}</Typography>
                {user.isModerator && <Typography component='p'>Admin</Typography>}
              </div>
              <Divider/>
            </div>
          }
          <List>
            { user &&
              <ListItem button>
                <Link className='link' to={pages.account.path}>
                  <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                  <ListItemText primary={pages.account.label} />
                </Link>
              </ListItem>
            }

            { user && user.isModerator
              <ListItem button>
                <Link className='link' to={pages.moderator.path}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary={pages.moderator.label} />
                </Link>
              </ListItem>
            }

            <ListItem button>
              <Link className='link' to={pages.tutorial.path}>
                <ListItemIcon><SchoolIcon/></ListItemIcon>
                <ListItemText primary={pages.tutorial.label} />
              </Link>
            </ListItem>
            <ListItem button>
              <Link className='link' to={pages.about.path}>
                <ListItemIcon><HelpIcon/></ListItemIcon>
                <ListItemText primary={pages.about.label} />
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
      </Drawer>
    );
  }
}
export default withStyles(styles)(DrawerContainer);
