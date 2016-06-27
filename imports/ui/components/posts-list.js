import React from 'react';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';

export const PostsList = ({ posts }) => (
  posts.length > 0 ? <ListGroup className="posts-list">
    {posts.map((post) => (
      <ListGroupItem key={ post.uid } href={ post.href }>
        { post.label }
      </ListGroupItem>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No posts found.</Alert>
);

PostsList.propTypes = {
  posts: React.PropTypes.array,
};
