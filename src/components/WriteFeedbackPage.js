// let the user write a feedback.

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center'
  },
  closeIcon: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end'
  },
  subtitle: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3
  },
  content: {
    width: '80%',
    marginTop: theme.spacing.unit * 2
  },
  button: {
    width: '80%',
    marginTop: theme.spacing.unit * 3
  }
});

class WriteFeedbackPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: true
    };
  }

  handleChange = (event) => {
    this.setState({
      error: !event.target.value,
      feedback: event.target.value
    });
  }

  render() {
    const { user, classes, handleClose } = this.props;

    return (
        <div className={classes.container}>
          <AppBar position='static'>
            <Toolbar>
              <Typography variant='h6' color='inherit'>
                Feedback
              </Typography>
              <div className={classes.closeIcon}>
                <CloseIcon onClick={handleClose} />
              </div>
            </Toolbar>
          </AppBar>
          <Typography align='left' variant='subtitle1' color='inherit' className={classes.subtitle}>
            We would appreciate if you can provide any feedback:
          </Typography>
          <TextField
            className={classes.content}
            id='feedback-textfield'
            placeholder='eg. I like the app'
            onChange={this.handleChange}
            autoFocus
            variant='filled'
            type='string'
            required
            margin='dense'
            rows='20'
            rowsMax='50'
            multiline
          />
          <Button
            color='secondary'
            className={classes.button}
            disabled={this.state.error}
            variant='contained'
            onClick={() => {}}
          >
            Submit
          </Button>
        </div>
    );
  }
}

WriteFeedbackPage.propTypes = {
  user: PropTypes.object
};

export default withStyles(styles)(WriteFeedbackPage);
