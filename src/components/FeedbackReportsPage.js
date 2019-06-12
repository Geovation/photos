import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import BackIcon from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from '../utils';
import PageWrapper from './PageWrapper';
import dbFirebase from '../dbFirebase';
import './ModeratorPage.scss';

const styles = theme => ({
  checkbox: {
    marginTop: theme.spacing(1),
    marginLeft: 0,
  },
  truncate: {
    maxWidth: '95%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  notchTop: {
    paddingTop:  isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' :
    isIphoneAndCordova ? theme.spacing(1.5) : null
  },
  iconButton: {
    marginRight: theme.spacing(2),
  },
  main: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1.5),
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  },
});

class FeedbackReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAll: false,
      feedbacks: null,
      feedback: null,
      isDialogOpen: false
    };
  }

  async componentDidMount() {
    const feedbacks = await dbFirebase.fetchFeedbacks(this.state.isShowAll);
    this.setState({ feedbacks });
  }

  handleItemClick = (feedback) => {
    this.setState({
      feedback,
      isDialogOpen: true
    });
  };

  handleDialogClose = () => {
    this.setState({ isDialogOpen: false });
  };

  handleResolvedClick = async (feedback) => {
    await dbFirebase.toggleUnreadFeedback(feedback.id, feedback.resolved, this.props.user.id);
    const feedbacks = await dbFirebase.fetchFeedbacks(this.state.isShowAll);
    this.setState({ feedbacks });
  };

  handleCheckboxChange = async (e) => {
    const checked = e.target.checked;
    const feedbacks = await dbFirebase.fetchFeedbacks(checked);
    this.setState({
      isShowAll: checked,
      feedbacks
    });
  }

  render() {
    const { label, handleClose, fullScreen, classes } = this.props;

    return (
      <PageWrapper label={label} handleClose={handleClose}>
        <div>
          <FormControlLabel
            className={classes.checkbox}
            control={<Checkbox onChange={this.handleCheckboxChange}/>}
            label="Show All"
          />

          {this.state.feedbacks &&
            <List dense={false}>
              {this.state.feedbacks.filter(feedback => !feedback.resolved || this.state.isShowAll)
                .sort( (a,b) => b.updated.toDate()-a.updated.toDate())
                .map(feedback => (
                  <div key={feedback.id}>
                    <Divider />
                    <ListItem key={feedback.id} button onClick={() => this.handleItemClick(feedback)}>
                      <ListItemText disableTypography
                        primary={
                          <Typography className={classes.truncate}
                            style={feedback.resolved ? {fontWeight: 'normal'} : {fontWeight: 'bold'}}
                          >
                            {feedback.feedback}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton aria-label='Resolved' edge={false} onClick={() => this.handleResolvedClick(feedback)}>
                          {feedback.resolved ? <DoneOutlineIcon /> : <DoneIcon />}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </div>
                ))
              }
              <Divider />
            </List>
          }
        </div>

        {this.state.feedback &&
          <Dialog
            fullScreen={fullScreen}
            open={this.state.isDialogOpen}
            aria-labelledby="responsive-dialog-title"
          >
            <AppBar position='static' className={classes.notchTop}>
              <Toolbar>
                <BackIcon className={classes.iconButton} onClick={this.handleDialogClose} />
                <Typography variant='h6' color='inherit'>Feedback Details</Typography>
              </Toolbar>
            </AppBar>

            <DialogContent className={classes.main}>
              {
                Object.keys(this.state.feedback).map(key => (
                  <div key={key} style={{textAlign: 'justify', padding: '5px'}}>
                    <b>{key + ': ' }</b>
                    { "" + (this.state.feedback[key].toDate ? this.state.feedback[key].toDate() : this.state.feedback[key])}
                  </div>
                ))
              }
            </DialogContent>

            <DialogActions>
              <Button
                className={classes.button}
                fullWidth
                variant='contained'
                color='secondary'
                onClick={() => {
                  this.handleResolvedClick(this.state.feedback);
                  this.handleDialogClose();
                }}
              >
                {this.state.feedback.resolved ? 'Unsolved' : 'Resolved'}
              </Button>
            </DialogActions>
            <div className={classes.notchBottom}/>
          </Dialog>
        }
      </PageWrapper>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(FeedbackReportsPage));
