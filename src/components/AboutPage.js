import React from 'react';
import PageWrapper from './PageWrapper';
import Typography from '@material-ui/core/Typography';
import config from '../custom/config';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  typography : {
    ...theme.mixins.gutters(),
    whiteSpace: 'pre-wrap',
  }
});

class AboutPage extends React.Component {
  render() {
    const { classes, label } = this.props;
    return (
      <PageWrapper label={label} handleClose={this.props.handleClose} hasLogo={true}>
        <Typography align={'justify'} variant={'subtitle1'} className={classes.typography}>
          {config.customiseString('about', 'We are Geovation and we Geovate')}
          <br /><br /><br />
            Version {process.env.REACT_APP_VERSION}, build {process.env.REACT_APP_BUILD_NUMBER}
        </Typography>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(AboutPage);
