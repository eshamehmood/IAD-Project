import React, { Fragment } from 'react';
import NoImg from '../../img/no-img.png';

import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = ((theme) => ({

}))

const PostSkeleton = (props) => {
    const { classes } = this.props;

    const content = Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
            <CardMedia className={classes.cover} image={NoImg} />
            <CardContent className={classes.CardContent}>
            </CardContent>
        </Card>
    ))

    return <Fragment>{content}</Fragment>
}

export default withStyles(useStyles)(PostSkeleton);
