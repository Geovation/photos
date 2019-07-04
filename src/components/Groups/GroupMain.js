import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import PageWrapper from '../../components/PageWrapper';
// import config from '../../custom/config';

const styles = theme => ({
  content: {
    height: '100%',
    overflow:'auto',
    '-webkit-overflow-scrolling': 'touch',
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    alignItems: 'center',
  },
  root: {
    flexGrow: 1,
  },
  icon: {
    fontSize: 60,
    margin: theme.spacing(0.5),
    alignItems: 'center',
  },
  labeltext: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(0.5),
  },

});


class Groups extends React.Component {
  groupListLink = () => {
    this.props.history.push(this.props.config.PAGES.grouplist.path);
  }

  groupAddLink = () => {
    this.props.history.push(this.props.config.PAGES.groupadd.path);
  }

  render() {
    const { handleClose, label, classes } = this.props;

    return (
        <PageWrapper label={label} handleClose={handleClose} hasLogo={true}>

          <div>
            <Grid container spacing={3}>

              <Grid item xs={3}>
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={this.groupListLink}>
                  list my groups
                  <GroupIcon className={classes.icon}>list groups</GroupIcon>
                </Button>
              </Grid>

              <Grid item xs={3}>
              </Grid>



              <Grid item xs={3}>
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={this.groupAddLink}>
                  add a group
                  <GroupAddIcon className={classes.icon}>add a group</GroupAddIcon>
                </Button>
              </Grid>

              <Grid item xs={3}>
              </Grid>

            </Grid>
          </div>

        </PageWrapper>
    );
  }
}


export default withStyles(styles)(Groups);