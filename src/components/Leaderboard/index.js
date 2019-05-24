import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import StarsIcon from '@material-ui/icons/Stars';

import PageWrapper from '../../components/PageWrapper';
import config from '../../custom/config';

const styles = theme => ({
  th: {
    fontWeight: 'bold',
    color: theme.palette.common.white,
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
  },
  firstRow: {
    fontWeight: 'bold',
    color: config.THEME.palette.secondary.main,
  },
  cell: {
    position: 'relative',
    padding: theme.spacing.unit,
    fontSize: 'inherit',
  },
  truncate: {
    position: 'absolute',
    top: theme.spacing.unit * 1.5,
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});


class Leaderboard extends Component {

  render() {
    const { classes, label, usersLeaderboard, handleClose, config } = this.props;
    usersLeaderboard.sort((a,b) => b[config.LEADERBOARD_FIELD.field] - a[config.LEADERBOARD_FIELD.field]);

    return (
      <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell className={`${classes.th} ${classes.cell}`} style={{width:'10%', textAlign:'center'}}>Rank</TableCell>
                <TableCell className={`${classes.th} ${classes.cell}`} style={{width:'60%'}}>User</TableCell>
                <TableCell className={`${classes.th} ${classes.cell}`} style={{width:'10%'}}>{[config.LEADERBOARD_FIELD.label]}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              { usersLeaderboard.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className={classes.cell} style={{textAlign: 'center'}}>
                    {index === 0 ? <StarsIcon color='secondary'/> : index + 1}
                  </TableCell>
                  <TableCell className={`${!index && classes.firstRow} ${classes.cell}`}>
                    <div className={classes.truncate}>{user.displayName}</div>
                  </TableCell>
                  <TableCell className={`${!index && classes.firstRow} ${classes.cell}`}>{user[config.LEADERBOARD_FIELD.field]}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(Leaderboard);
