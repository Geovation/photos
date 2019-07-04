import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import PageWrapper from "../PageWrapper";
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    message: {
        color: theme.palette.common.black,
        padding: theme.spacing(1.5),
        fontSize: 'inherit',
    },
});


class GroupAdd extends React.Component {
    render()
    {
        const {classes, label, handleClose} = this.props;
        return (
                <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
                    <Typography variant='h1' color='inherit' className={classes.message}>feature coming soon!</Typography>
            </PageWrapper>
        );
    }
}

export default withStyles(styles)(GroupAdd);