
// listing posts for editing for authenticated users
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import PostsList from '../containers/posts-list.js';
import { newPost } from '../../api/posts/methods.js';
import { browserHistory } from 'react-router';


const handleNewPost = (event) => {
  event.preventDefault();

  newPost.call({
    // nothing here; everything is taken care of with autovalues
  }, (error, postId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      browserHistory.push(`/posts/${ postId }/edit`);
      Bert.alert('Post added!', 'success');
    }
  });
};


export const Posts = () => (
  <Row>
    <Col xs={12} sm={8} smOffset={2} >
      <Button bsStyle="success" onClick={ handleNewPost }>New Post</Button>
      <h4 className="page-header">Posts</h4>
      <PostsList />
    </Col>
  </Row>
);