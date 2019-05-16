import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import PageWrapper from '../../components/PageWrapper';

const CustomTableCell = withStyles(theme => ({
  head: {
    // color scheme for plastic patrol
    // backgroundColor: '#006a6b',
    // color scheme for photos - leaderboard header
    backgroundColor: '#bf7800',

    color: theme.palette.common.black,
    padding: 6,
    },
  body: {
    fontSize: 13,
    padding: 6,
  },
}))(TableCell);

const styles = theme => ({
  typography : {
    ...theme.mixins.gutters(),
    whiteSpace: 'pre-wrap',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: 0,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


class Leaderboard extends React.Component {

  render() {

    const { classes, label, usersLeaderboard } = this.props;

    usersLeaderboard.sort(function(a,b){
      return b.uploaded - a.uploaded;
    });

    return (
      <PageWrapper label={label} handleClose={this.props.handleClose} hasLogo={false}>
        <Typography align={'justify'} variant={'subtitle1'} className={classes.typography}>
         <Paper className={classes.root}>
            <Table className={classes.table}>

            <TableHead>
              <TableRow>
                <CustomTableCell>rank</CustomTableCell>
                <CustomTableCell>user</CustomTableCell>
                <CustomTableCell>uploaded</CustomTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              { usersLeaderboard.map((user, index) => (
              <TableRow key={user.uid}>
               <CustomTableCell component="th" scope="row">
                  {index + 1}
                </CustomTableCell>
                {/*<CustomTableCell align="right" padding={'dense'}>{index + 1}</CustomTableCell>*/}
                <CustomTableCell padding={'dense'}>{user.displayName}</CustomTableCell>
                <CustomTableCell padding={'dense'}>{user.uploaded}</CustomTableCell>
              </TableRow>
                ))}
            </TableBody>

            </Table>
          </Paper>
        </Typography>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(Leaderboard);
