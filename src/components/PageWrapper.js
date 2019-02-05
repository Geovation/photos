import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { isIphoneWithNotchAndCordova } from '../utils';
import config from '../custom/config';
const placeholderImage = process.env.PUBLIC_URL + "/custom/images/banner.svg";

const styles = theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    position:'fixed',
    right:0,
    left:0,
    bottom:0,
  },
  main:{
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection:'column',
    flex: 1,
    overflowY: 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  closeIcon: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end'
  },
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' : 0
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  },
  logo: {
    height: '80px',
    margin: theme.spacing.unit * 2,
  },
});

class PageWrapper extends React.Component {

  handleClose = () => {
    this.props.handleClose();
  }

  changeStatusBarColorToDefault = () => {
    const palette = this.props.theme.palette;
    if(isIphoneWithNotchAndCordova() && palette.primary.main === palette.common.black){
      window.StatusBar.styleDefault();
    }
  }

  changeStatusBarColorToLight = () => {
    const palette = this.props.theme.palette;
    if(isIphoneWithNotchAndCordova() && palette.primary.main === palette.common.black){
      window.StatusBar.styleLightContent();
    }
  }

  componentDidMount(){
    this.changeStatusBarColorToLight();
  }

  componentWillUnmount(){
    this.changeStatusBarColorToDefault();
  }

  render() {
    const { classes, children, label, hasLogo } = this.props;
    return (
        <div className={classes.container}>
          <AppBar position='static' className={classes.notchTop}>
            <Toolbar>
              <Typography variant='h6' color='inherit'>
                {label}
              </Typography>
              <div className={classes.closeIcon}>
                <CloseIcon onClick={this.handleClose} />
              </div>
            </Toolbar>
          </AppBar>
          {hasLogo && <img className={classes.logo} src={placeholderImage} alt={config.customiseString('about', 'Geovation')}/>}
          <div className={classes.main}>
            {children}
          </div>

          <div className={classes.notchBottom}/>
        </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PageWrapper);
