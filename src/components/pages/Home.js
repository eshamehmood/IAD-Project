import React, { Component } from 'react';
import Post from '../posts/Post'
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getPostForHome } from '../../store/actions/postActions'
import PropTypes from 'prop-types';

class Home extends Component {
    componentDidMount() {
        if (!this.props.auth.uid) return <Redirect to='/signin' />
        this.props.getPostForHome();
    }
    render() {
        const { auth, posts, loading } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />
        console.log(posts);
        // let recentPostsMarkup = !loading ? (
        //     posts && posts.map((post, i) => {
        //         return (
        //             <Grid item xs={10} key={post.postId}>
        //                 <Post post={post} />
        //             </Grid>
        //         )
        //     }
        //     )
        //     //     <Post post={
        //     //         {
        //     //             postId: "s2nMaZO53Z59z6z163Wr",
        //     //             body: "posting",
        //     //             authorName: "a a",
        //     //             authorId: "qbAJJkTArfePsp7C3xyCUUxuIxf2",
        //     //             commentCount: 0,
        //     //             likeCount: 0,
        //     //             imageName: "",
        //     //             liked: true,
        //     //         }
        //     //     } />
        // ) : (
        //         <div>Loading</div>
        //     )
        const postItems = this.props.posts.map(post => (
            <div key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </div>
        ))
        return (
            <Grid
                container
                spacing={4}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ maxWidth: '100vw', marginTop: '1%' }}
            >
                {/* {recentPostsMarkup} */}
                {postItems}
            </Grid>
        );
    }
}

Home.propTypes = {
    getPostForHome: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        posts: state.post.posts,
        auth: state.firebase.auth,
        // posts: state.firestore.ordered.posts,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPostForHome: () => (dispatch(getPostForHome()))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
