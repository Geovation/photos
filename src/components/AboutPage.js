import React from 'react';
import placeholderImage from '../custom/images/geovation_logo.svg';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './AboutPage.scss';

class AboutPage extends React.Component {

  handleClickButton = () => {
    this.props.goToPage(this.props.pages.map); // go to the map
  };

  render() {
    return (
      <div className={'geovation-about'}>
        <img className={'logo'} src={placeholderImage} alt='geovation'/>
        <div className={'main'}>
          <Typography>
            We are Geovation and we Geovate
          </Typography>
        </div>
        <div className='button'>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            onClick={this.handleClickButton}
          >
            Get Collecting
          </Button>
        </div>
      </div>
    );
  }
}

export default AboutPage;
