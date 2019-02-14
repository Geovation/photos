import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card : {
    width:'100%'
  }
});

class CardComponent extends React.Component {

  presentField = (fieldName, fieldValue) => {
    let rtn;
    switch (fieldName) {
      case 'location':
        const link = `https://www.google.com/maps/@${fieldValue.latitude},${fieldValue.longitude},18z`;
        rtn = (<a href={link} target="_">See Google Map</a>);
        break;
      case 'moderated':
        rtn = new Date(fieldValue).toDateString();
        break;
      case 'updated':
        rtn = new Date(fieldValue).toDateString();
        break;
      case 'thumbnail':
      case 'main':
        rtn = (<a href={fieldValue} target="_">See photo</a>);
        break;
      default:
        rtn = `${fieldValue}`;
    }
    return rtn;
  }

  render() {
    const { photoSelected, handleRejectClick, handleApproveClick, classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            {Object.keys(photoSelected).map(key => (
              <div key={key}>
                {key}: <strong>{this.presentField(key,photoSelected[key])}</strong>
              </div>
            ))}
          </CardContent>
        </CardActionArea>
        <CardActions>
        { handleRejectClick &&
          <IconButton aria-label='Reject' onClick={() => handleRejectClick(photoSelected)}>
            <ThumbDownIcon />
          </IconButton>
        }
        { handleApproveClick &&
          <IconButton aria-label='Approve' onClick={() => handleApproveClick(photoSelected)}>
            <ThumbUpIcon />
          </IconButton>
        }
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(CardComponent);
