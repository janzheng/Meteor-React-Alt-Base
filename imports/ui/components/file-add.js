
/*

    Add a File to the Files collection
    – works independently from the Files list
    – the container can take an additional .src prop to denote a related post (not reflected in this component)

*/

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl, Col, Row, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { assignBrowse, assignDrop, handleUpload, stopUpload, cleanAll } from '../../api/files/methods.js';



export class FileAdd extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sessions: {}, // upload sessions
    };

    this.renderStatus = this.renderStatus.bind(this);
    this.triggerCancelUpload = this.triggerCancelUpload.bind(this);
  }


  componentDidMount( component ) {

    // delete all the resumables
    cleanAll();

    // initiates the drag and drop area and upload button
    // to work with resumable. Resumable runs on jQuery
    // so we use jQuery objects here
    let targetArea = $('#fileDropArea');
    let targetButton = $('#fileDropBtn');

    assignDrop(targetArea);
    assignBrowse(targetButton);

    // starts the resumable upload event cycle
    handleUpload(this);
  }

  triggerCancelUpload (key) {

    stopUpload(key);

    // set the 'abort' flag to true
    // used for showing "aborted" status
    let sessions = this.state.sessions;
    sessions[key].aborted = true;
    this.setState({sessions: sessions});
  }


  /*

    Render Status Method
    ----

    This method renders the list of current uploads (current file sessions)

    Object.keys() converts an object into an array, which we can map and display.

    The sessions object looks like:
    {
      123456:
        filename: "filename",
        progress: 50
    }
    – 123456 –    the file ID used by resumable for each upload
    – progress –  as in "50%" – actively updated by resumable, from the handleUpload function in api/files/methods.js
    – aborted –   only appears when user cancels an upload

  */

  renderStatus( ) {
    let sessions = this.state.sessions;

    // check if the number of file sessions is empty by converting the object into an array and counting the length
    // the constructor check makes sure we're looking at an object
    let isEmpty = Object.keys(sessions).length === 0 && sessions.constructor === Object;

    return (
      !isEmpty ? <ListGroup className="sessions-list">

        {Object.keys(sessions).map((key) => (
          <ListGroupItem key={ key }>
            { this.state.sessions[key].aborted ? 'Canceled: ' : '' }
            { sessions[key].filename } [ { sessions[key].progress }% ] { (sessions[key].progress < 100 && (!sessions[key].aborted)) ? <Button onClick={ this.triggerCancelUpload.bind(this, key) }>Cancel</Button> : ''}
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
