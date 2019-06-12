import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import BackIcon from '@material-ui/icons/ArrowBack';
import utils, { isIphoneWithNotchAndCordova, isIphoneAndCordova } from '../utils';
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
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection:'column',
    flex: 1,
    overflowY: 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  iconButton: {
    marginRight: 20,
  },
  grow: {
    flexGrow: 1,
  },
  notchTop: {
    paddingTop:  isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' :
      isIphoneAndCordova ? theme.spacing(1.5) : null
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  },
  logo: {
    height: '80px',
    margin: theme.spacing(2),
  },
});

class PageWrapper extends React.Component {

  handleClose = () => {
    this.props.handleClose();
  }

  handleNext = () => {
    this.props.handleNext();
  }

  handlePrev = () => {
    this.props.handlePrev();
  }

  changeStatusBarColorToDefault = () => {
    const palette = this.props.theme.palette;
    if( isIphoneAndCordova && palette.primary.main === palette.common.black){
      window.StatusBar.styleDefault();
    }
  }

  changeStatusBarColorToLight = () => {
    const palette = this.props.theme.palette;
    if( isIphoneAndCordova && palette.primary.main === palette.common.black){
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
    const {
      classes, children, label,
      hasLogo, error,
      nextClicked, photoPage
    } = this.props;
    return (
        <div className={classes.container}>
          <AppBar position='static' className={classes.notchTop}>
            <Toolbar>
              {photoPage && nextClicked
                ?
                  <BackIcon className={classes.iconButton} onClick={this.handlePrev} />
                :
                  <CloseIcon className={classes.iconButton} onClick={this.handleClose} />
              }
              <Typography className={classes.grow} variant='h6' color='inherit'>
                {label}
              </Typography>
              {photoPage && !nextClicked &&
                <Button disabled={!this.props.enableNext} color='secondary' onClick={this.handleNext}>
                  Next
                </Button>
              }
              {photoPage && nextClicked &&
                <Button disabled={error}
                  color="secondary" onClick={this.props.sendFile}>
                  Upload
                </Button>
              }
            </Toolbar>
          </AppBar>
          {hasLogo && <img className={classes.logo} src={placeholderImage} alt={utils.customiseString('about', 'Geovation')}/>}
          <div className={classes.main}>
            {children}
          </div>

          <div className={classes.notchBottom}/>
        </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PageWrapper);
