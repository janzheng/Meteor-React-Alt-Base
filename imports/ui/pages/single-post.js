
// public, published posts only

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Post from '../containers/single-post.js';

export const SinglePost = ( { params } ) => (
  <div className="posts">
    <Row>
      <Col xs={12} sm={8} smOffset={2} >
        <Post singlePost={ true } slug={ params.slug } />
      </Col>
    </Row>
  </div>
);
