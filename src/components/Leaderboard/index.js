import React, {Component} from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StarsIcon from '@material-ui/icons/Stars';

import PageWrapper from '../../components/PageWrapper';
import config from '../../custom/config';

const styles = theme => ({
  th: {
    padding: 10,
    fontSize: 'inherit',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
  },
  firstRow: {
    padding: 10,
    fontSize: 'inherit',
    fontWeight: 'bold',
    color: config.THEME.palette.secondary.main,
  },
  tb: {
    padding: 10,
    fontSize: 'inherit',
  },
});


class Leaderboard extends Component {

  render() {
    const { classes, label, usersLeaderboard, handleClose } = this.props;
    usersLeaderboard.sort((a,b) => b.uploaded - a.uploaded);

    return (
      <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
          <Table >

            <TableHead>
              <TableRow>
                <TableCell className={classes.th} style={{width:'15%'}}>Rank</TableCell>
                <TableCell className={classes.th} style={{width:'65%'}}>User</TableCell>
                <TableCell className={classes.th} style={{width:'20%'}}>Uploaded</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              { usersLeaderboard.map((user, index) => (
                <TableRow >
                  <TableCell className={classes.tb} style={{textAlign: 'center'}} component="th" scope="row">
                    {index === 0 ? <StarsIcon color='secondary'/> : index + 1}
                  </TableCell>
                  {index === 0 ?
                    <TableCell className={classes.firstRow}>{user.displayName}</TableCell>
                  :
                    <TableCell className={classes.tb}>{user.displayName}</TableCell>
                  }
                  {index === 0 ?
                    <TableCell className={classes.firstRow}>{user.uploaded}</TableCell>
                  :
                    <TableCell className={classes.tb}>{user.uploaded}</TableCell>
                  }
                </TableRow>
              ))}
            </TableBody>

          </Table>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(Leaderboard);
