import React, { Component } from 'react';
import Post from '../posts/Post'
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getPostForHome, clearUser, clearPosts, atMyPage, notAtMyPage } from '../../store/actions/dataActions'

class Home extends Component {
    componentDidMount() {
        this.props.atMyPage();
        this.props.clearUser();
        this.props.getPostForHome();
    }
    componentWillUnmount() {
        this.props.notAtMyPage();
        this.props.clearPosts();
    }
    render() {
        const { user: { authenticated }, data: { posts, loading } } = this.props;
        const userLoading = this.props.user.loading;
        if (!authenticated) return <Redirect to='/signin' />
        let recentPostsMarkup = !loading && !userLoading ?
            posts && posts.length !== 0 ? posts.map(post =>
                <Grid
                    style={{ maxWidth: '100%' }} item xs={10} key={post.postId}>
                    <Post post={post} />
                </Grid>
            ) :
                <Grid item xs={10}>
                    <Card>
                        <CardContent> No Post to show. <br /> <br /> Please follow users to see posts.
                    </CardContent>
                    </Card>
                </Grid> :
            <CircularProgress
                style={{
                    margin: 0,
                    position: 'absolute',
                    top: '50%'
                }} />;
        return (
            <Grid
                container
                spacing={4}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ marginTop: '1%' }}
            >
                {recentPostsMarkup}
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
})

const mapDispatchToProps = {
    getPostForHome, clearUser, clearPosts, atMyPage, notAtMyPage
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
