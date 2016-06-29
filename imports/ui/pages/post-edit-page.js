import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import PostEdit from '../containers/__post-edit.js';
import { browserHistory } from 'react-router';



export const PostEditPage = ( { params } ) => (
  <Row>
    <Col xs={12} sm={8} smOffset={2} >
      <h4 className="page-header">Edit Post</h4>
      <PostEdit id={ params._id }/>
    </Col>
  </Row>
);
