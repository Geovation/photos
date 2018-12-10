import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';



import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import './Header.scss';

import PropTypes from 'prop-types';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleMenu = (event) => {
    if (!this.props.user) {
      this.props.handleClickLoginLogout();
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleProfileClick = () => {
    this.handleClose();
    this.props.handleProfileClick();
  }

  render() {
    const open = Boolean(this.state.anchorEl);

    return <div className="geovation-header">
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" className="menuButton"
                        onClick={this.props.handleDrawerClick}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" color="inherit" className="grow">
            {this.props.headline}
          </Typography>

          <div>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
              disabled={!this.props.online}
            >
              <AccountCircleIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleProfileClick}>
                <ListItemIcon>
                  <AccountCircleIcon/>
                </ListItemIcon>
                <Typography>Profile</Typography>
              </MenuItem>

              <MenuItem onClick={this.props.handleClickLoginLogout}>
                <ListItemIcon>
                  <ExitToAppIcon/>
                </ListItemIcon>
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>;
  }
}

Header.propTypes = {
  headline: PropTypes.string.isRequired,
  user: PropTypes.object,
  online: PropTypes.bool,
  handleClickLoginLogout: PropTypes.func,
  handleDrawerClick: PropTypes.func,
  handleProfileClick: PropTypes.func
};

export default Header;
