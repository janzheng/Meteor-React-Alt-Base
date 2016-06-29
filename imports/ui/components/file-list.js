import React from 'react';
import { ListGroup, Alert, Col, Row } from 'react-bootstrap';
import { File } from './file.js';

export const FileList = ({ files }) => (
    files.length > 0 ? <div className="files-list">
      
      <Row>
        <Col xs={12}>

          <h4>{ files.length } Files</h4>
        </Col>
      </Row>
      <ListGroup>
      {files.map((file) => ( 
          <File key={ file._id } file={ file } />
        )
      )}
    </ListGroup></div> :
    <Alert bsStyle="warning">No files yet.</Alert>
);

FileList.propTypes = {
  files: React.PropTypes.array,
};
