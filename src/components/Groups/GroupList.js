import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import config from '../../custom/config';
import PageWrapper from "../PageWrapper";

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
        padding: theme.spacing(1),
        fontSize: 'inherit',
    },
    truncate: {
        position: 'absolute',
        top: theme.spacing(1.5),
        maxWidth: '90%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});


class GroupList extends React.Component {
    render()
    {
        const {handleClose, classes, label, groupsArray, config} = this.props;
        groupsArray.sort((a,b) => b[config.GROUPS_FIELD.name] - a[config.GROUPS_FIELD.name]);
        console.log("groups array:", groupsArray);

        return (
            <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={`${classes.th} ${classes.cell}`}></TableCell>
                            {/*{[config.GROUPS_FIELD.name]}*/}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell>your groups here - coming soon!</TableCell>
                        </TableRow>

                        {/*<TableBody>*/}
                        {/*    { users.slice(0,config.GROUPS_FIELD.displayedUsers)*/}
                        {/*        .map((user, index) => (*/}
                        {/*            <TableRow key={index}>*/}
                        {/*                <TableCell className={classes.cell} style={{textAlign: 'center'}}>*/}
                        {/*                </TableCell>*/}
                        {/*                <TableCell className={`${!index && classes.firstRow} ${classes.cell}`}>*/}
                        {/*                    <div className={classes.truncate}>{user.displayName}</div>*/}
                        {/*                </TableCell>*/}
                        {/*                <TableCell className={`${!index && classes.firstRow} ${classes.cell}`}>{user[config.GROUPS_FIELD.description]}</TableCell>*/}
                        {/*            </TableRow>*/}
                        {/*        ))}*/}
                    </TableBody>

                </Table>
            </PageWrapper>
        );

    }
}

export default withStyles(styles)(GroupList);