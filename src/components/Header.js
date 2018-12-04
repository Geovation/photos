import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import PropTypes from 'prop-types';

const Header = (props) =>
    <AppBar position="static" className="header">
      <Toolbar>
        {/*<Link to="/" style={{ textDecoration: 'none', display: 'block' }}>*/}
          {/*<IconButton color="inherit" aria-label="Home" >*/}
            {/*<ChevronLeftIcon />*/}
          {/*</IconButton>*/}
        {/*</Link>*/}
        {props.headline}
      </Toolbar>
    </AppBar>;

Header.proppTypes = {
  headline: PropTypes.string.isRequired
};

export default Header;
