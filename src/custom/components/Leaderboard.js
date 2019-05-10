import React from 'react';
// import PropTypes from 'prop-types';
import PageWrapper from '../../components/PageWrapper';
// import config from '../config.js';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

    const data = [
        {
          "updated": "2019-05-09T14:30:27.657Z",
          "totalUploaded": 16979,
          "published": 8445,
          "users": [

            {"displayName":"Joy Kuo",
            "uploaded": 8219,
            "pieces": 123,
            "uid": "7BTJcJgpkc68462FQVn60H03HWy2"},

            {"displayName":"Seb Geo",
            "uploaded": 465,
            "pieces": 465,
            "uid": "7BTJcApm9Jgpkc6FQVn60H2bX2y2"},

            {"displayName": "Me again !",
            "uploaded": 0,
            "pieces": 2,
            "uid": "7t9moySOd2PPSDYcW004j2141423"},

            {"displayName": "global avocado",
            "uploaded": 0,
            "pieces": 20,
            "uid": "ARrGwkwr8xcg8QkQCvhxSs6F95B3"},

            {"displayName":"Y",
            "uploaded": 0,
            "pieces": 230,
            "uid": "AdHP8OLjimVbfYZDg9EUw6f0krj2"},

            {"displayName": "asdf",
            "uploaded": 0,
            "pieces": 134,
            "uid": "CmI0vPc9p0cyL0SYsntNO4aQp1Q2"},

            {"displayName": "&lt;h1&gt;asdfg",
            "uploaded": 0,
            "pieces": 6,
            "uid": "Oyz3R39zeDbYYIUs616fk1JsZ4m1"},

            {"displayName": "Konstantinos Dalkafoukis",
            "uploaded": 8444,
            "pieces": 67,
            "uid": "DUMGwkwr8xcbekkQCvhxSs6395B3"},

            {"displayName": "some person",
            "uploaded": 0,
            "pieces": 23,
            "uid": "gGrlYb4q6hWCy24xoTuTFSwLNGK2"},

            {"displayName": "geolicious",
            "uploaded": 0,
            "pieces": 784,
            "uid": "pGv9dn5xZTSoPHvntjvvdWkchxe2"}

            ],

          "rejected": 0,
          "pieces": 123,
          "moderated": 8445,
          "serverTime": "2019-05-09T14:30:49.048Z"
        }
    ]

    const userarray = data[0].users;
    console.log('user array from local json:', userarray);


class Leaderboard extends React.Component {
  render() {

    const { classes, label } = this.props;
    userarray.sort(function(a,b){
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
              {userarray.map((user, index) => (
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
