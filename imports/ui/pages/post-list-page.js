
/*

    Display a list posts
    – Public, published posts only

*/

import React from 'react';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import PostList__Public from '../containers/__post-list__public.js';


const renderHeader = (params) => {

  if(params.tag) {
    return <Jumbotron className="tags-header">
      <h4>Posts tagged with: { params.tag }.</h4>
      </Jumbotron>;
  } else {
    return <Jumbotron className="blog-header">
      <h2>Get Buff</h2>
      <h4>A new blog by the HD Buff crew.</h4>
    </Jumbotron>;
  }
}

export const PostListPage = ( { params } ) => (
  <div className="posts">
    <Row>
      <Col xs={12} sm={8} smOffset={2} >
        <h4 className="page-header">Posts</h4>
        { renderHeader( params ) }
        <PostList__Public tag={ params.tag } />
      </Col>
    </Row>
  </div>
);
