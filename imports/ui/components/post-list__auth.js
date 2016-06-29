
/*

    Displays a list of posts for authenticated users
    – Each post's URL links to the edit page of the post

*/

import React from 'react';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';

export const PostList__Auth = ({ posts }) => (
  posts.length > 0 ? <ListGroup className="posts-list">
    {posts.map((post) => (
      <ListGroupItem key={ post.uid } href={ post.href }>
        { post.label }
      </ListGroupItem>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No posts found.</Alert>
);

PostList__Auth.propTypes = {
  posts: React.PropTypes.array,
};
