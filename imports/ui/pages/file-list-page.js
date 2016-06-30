
/*

    Page for FilesList
    – Display a list of Files

*/


import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col } from 'react-bootstrap';

import FileList from '../containers/__file-list.js';
import { FileAdd } from '../components/file-add.js';

export const FileListPage = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Files</h4>
      {/* only show AddFile dialogue if a logged in user */}
      { Meteor.userId() ? <FileAdd /> : '' }
      <FileList />
    </Col>
  </Row>
);
