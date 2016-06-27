import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FilesList from '../containers/files-list.js';
import { AddFile } from '../components/add-file.js';
import { Meteor } from 'meteor/meteor';

export const Files = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Files</h4>
      {/* only show AddFile dialogue if a logged in user */}
      { Meteor.userId() ? <AddFile /> : '' }
      <FilesList />
    </Col>
  </Row>
);
