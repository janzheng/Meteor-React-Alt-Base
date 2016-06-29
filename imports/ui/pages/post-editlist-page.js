
/*

    Displays a list of Posts for authenticated users
    – Click on a Post to edit the post

*/

// listing posts for editing for authenticated users
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import { newPost } from '../../api/posts/methods.js';
import PostList__Auth from '../containers/__post-list__auth.js';


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


export const PostEditlistPage = () => (
  <Row>
    <Col xs={12} sm={8} smOffset={2} >
      <Button bsStyle="success" onClick={ handleNewPost }>New Post</Button>
      <h4 className="page-header">Posts</h4>
      <PostList__Auth />
    </Col>
  </Row>
);

