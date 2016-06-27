import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl, Col, Row, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { assignBrowse, assignDrop, handleUpload, stopUpload } from '../../api/files/methods.js';



export class AddFile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sessions: {}, // upload sessions
    };

    this.renderStatus = this.renderStatus.bind(this);
    this.triggerCancelUpload = this.triggerCancelUpload.bind(this);
  }


  componentDidMount( component ) {

    let targetArea = $('#fileDropArea');
    let targetButton = $('#fileDropBtn');

    assignDrop(targetArea);
    assignBrowse(targetButton);

    handleUpload(this);
  }

  triggerCancelUpload (key) {

    stopUpload(key);

    // setting aborted = true kicks off the remove part of the fileProgress watch cycle
    // this ensures we don't do handle anything outside of the upload cycle
    let sessions = this.state.sessions;
    sessions[key].aborted = true;
    this.setState({sessions: sessions});
  }

  renderStatus( ) {

    let sessions = this.state.sessions;

    // check if the object is empty by converting the object into an array and counting the length
    // the constructor check makes sure we're looking at an object
    let isEmpty = Object.keys(sessions).length === 0 && sessions.constructor === Object;

    return (
      !isEmpty ? <ListGroup className="sessions-list">

        {/* 
          Object.keys() converts an object into an array, which we can map and display.
          The object looks like:
          {
            123456:
              filename: "filename",
              progress: 50
          }
          – 123456 is stored as the file id, and is always unique
          – progress is actively update by resumable, from the handleUpload function in api/files/methods.js
          the key is the
        */}
        {Object.keys(sessions).map((key) => (
          <ListGroupItem key={ key }>
            { this.state.sessions[key].aborted ? 'Canceled: ' : '' } { sessions[key].filename } [ { sessions[key].progress } { sessions[key].progress>-1 ? '%':''} ] { (sessions[key].progress < 100 && (!sessions[key].aborted)) ? <Button onClick={ this.triggerCancelUpload.bind(this, key) } > Cancel</Button> : ''}
          </ListGroupItem>
        ))}
      </ListGroup> : ''
    )
  }


  render() {
    return (
      <div className="addFile">
        <div id="fileDropArea">
          <Row >
            <Col xs={ 12 } >
              <h3>{ (this.props.title) ? this.props.title : 'Upload a File'}</h3> <span>Click upload or drag a file into this area</span>
              <div>
                <Button
                  bsStyle="success"
                  id="fileDropBtn">
                  Upload
                </Button>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col xs={ 12 }>
              { this.renderStatus() }
            </Col>
          </Row>
        </div>
      </div>
    )
  }
};
