
/*

    Page for displaying a single, published post

*/

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Post__Public from '../containers/__post-single__public.js';

export const PostSinglePage = ( { params } ) => (
  <div className="posts">
    <Row>
      <Col xs={12} sm={8} smOffset={2} >
        <Post__Public singlePost={ true } slug={ params.slug } />
      </Col>
    </Row>
  </div>
);
