import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SearchedUser from './SearchedUser';

class SearchResult extends Component {
    render() {
        const { searchUsers, authenticated } = this.props;
        if (!authenticated) return <Redirect to='/signin' />
        return (
            <Grid
                container
                spacing={4}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ maxWidth: '100vw', marginTop: '1%' }}
            >
                {
                    searchUsers && searchUsers.length !== 0 ? searchUsers.map(user =>
                        <Grid item xs={10} key={user.userId}>
                            <SearchedUser user={user} />
                        </Grid>) :
                        <Grid item xs={10}>
                            <Card>
                                <CardContent> No User Found
                                </CardContent>
                            </Card>
                        </Grid>
                }
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    searchUsers: state.data.searchUsers,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(
    SearchResult
);
