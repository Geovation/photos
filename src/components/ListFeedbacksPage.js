import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import MarkUnreadIcon from '@material-ui/icons/Markunread';
import MarkReadIcon from '@material-ui/icons/MarkunreadOutlined';
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
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import PageWrapper from './PageWrapper';
import dbFirebase from '../dbFirebase';
import './ModeratorPage.scss';
import * as actions from '../actions';

const styles = theme => ({
  root: {
    background:'rgba(255,225,225,0.5)'
  }
});

class ListFeedbacksPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      feedback: null,
      open: false
    };
  }

  componentDidMount() {
    console.debug(this.props);
    this.props.startFetchingToModerate();
  }

  componentWillUnmount() {
    console.debug(this.props);
    this.props.stopFetchingToModerate();
  }

  handleHideClick = (feedback) => {
    dbFirebase.toggleUnreadFeedback(feedback, this.props.user.id)
  };

  handleItemClick = (feedback) => {
    this.setState({
      feedback: feedback,
      open: true
    });
  };

  handleCloseClick = () => {
    this.setState({
      open: false,
    });
  };

  shortenSentence = (sentence) => {
    const returnWords = 7;
    const words = sentence.split(' ');
    if (words.length <= returnWords) {
      return sentence;
    }
    return words.slice(0, returnWords).join(' ') + ' ...';
  };

  render() {
    const { label, feedbacks, handleClose, classes } = this.props;

    return (
      <PageWrapper label={label} handleClose={handleClose}>

        <List dense={false}>
          {feedbacks.filter(feedback =>  !feedback.solved || this.state.showAll).map(feedback => (
            <div key={feedback.id}>
              <ListItem key={feedback.id} button  onClick={() => this.handleItemClick(feedback)}>
                <ListItemText disableTypography
                  primary={
                    <Typography
                      style={feedback.solved ? {fontWeight: 'normal'} : {fontWeight: 'bold'}}
                    >
                      {this.shortenSentence(feedback.feedback)}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label='Solved' onClick={() => this.handleHideClick(feedback)}>
                    {feedback.solved ? <MarkReadIcon /> : <MarkUnreadIcon />}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>

        <FormControlLabel
          control={<Checkbox onChange={(e) => {this.setState({showAll: e.target.checked})}}/>}
          label="Show All"
        />

        <Dialog
          // fullScreen={fullScreen}
          classes={{container: classes.root}}
          open={this.state.open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title"  style={{ textAlign: "center"}}>Feedback Details</DialogTitle>
            { this.state.feedback !== null &&
              <DialogContent>
              <div style={{padding: '5px'}}>
                <p>{'appVersion: ' + this.state.feedback.appVersion}</p>
                <p>{'buildNumber: ' + this.state.feedback.buildNumber}</p>
                <p>{'device: ' + this.state.feedback.device}</p>
                <p>{'email: ' + this.state.feedback.email}</p>
                <p>{'feedback: ' + this.state.feedback.feedback}</p>
                <p>{'moderator_id: ' + this.state.feedback.moderator_id}</p>
                <p>{'owner_id: ' + this.state.feedback.owner_id}</p>
                <p>{'solved: ' + this.state.feedback.solved}</p>
                <p>{'updated: ' + this.state.feedback.updated}</p>
                <p>{'userAgent: ' + this.state.feedback.userAgent}</p>
                </div>
              </DialogContent>
            }
          <DialogActions>
            <Button
              variant='contained'
              color='secondary'
              onClick={this.handleCloseClick}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </PageWrapper>
    );
  }
}

const mapStateToProps = state => ({
  feedbacks: state.feedbacks
})

const mapDispatchToProps = dispatch => ({
  startFetchingToModerate: actions.startFetchingToModerate('feedbacks', dispatch),
  stopFetchingToModerate: actions.stopFetchingToModerate
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMobileDialog()(withStyles(styles)(ListFeedbacksPage)));
