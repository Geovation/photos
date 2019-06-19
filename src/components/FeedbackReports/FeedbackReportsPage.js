import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

import PageWrapper from '../PageWrapper';
import dbFirebase from '../../dbFirebase';
import config from '../../custom/config';
import '../ModeratorPage.scss';

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
  }
});

class FeedbackReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAll: false,
      feedbacks: null,
    };
  }

  async componentDidMount() {
    const feedbacks = await dbFirebase.fetchFeedbacks(this.state.isShowAll);
    this.setState({ feedbacks });
  }

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
    const { user, label, handleClose, classes } = this.props;

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
                    <ListItem key={feedback.id} button component={Link}
                      to={{
                        pathname: config.PAGES.feedbackDetails.path,
                        state: {
                          feedback: feedback,
                          user: user
                        }
                      }}
                    >
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
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(FeedbackReportsPage);
