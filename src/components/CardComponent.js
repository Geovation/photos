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

  presentField(key,value) {
    let rtn = "-";
    const formater = this.props.fields[key];
    if (formater && value){
      rtn = formater(value);
    }
    else if(value){
       rtn = value;
    }
    return rtn;
  }

  render() {
    const { photoSelected, handleRejectClick, handleApproveClick, classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            {Object.entries(photoSelected).map(([key,value]) => (
              <div key={key}>
                {key}: <strong>{this.presentField(key,value)}</strong>
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
