import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import PageWrapper from "../PageWrapper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    message: {
        color: theme.palette.common.black,
        padding: theme.spacing(1.5),
        fontSize: 'inherit',
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
                <Typography variant='h1' color='inherit' className={classes.message}>your groups here - coming soon!</Typography>
            </PageWrapper>
        );

    }
}

export default withStyles(styles)(GroupList);