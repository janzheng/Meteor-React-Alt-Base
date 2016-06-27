import React from 'react';
import { ListGroupItem, Thumbnail, Row, Col, Button } from 'react-bootstrap';
import { Files } from '../../api/files/files.js';
import { isTypeImage, getReadableFileSizeString } from '../../modules/helpers.js';
import { deleteFile } from '../../api/files/methods.js';
import PostName from '../containers/post-name.js';
import Post from '../containers/single-post.js';


const renderAppearsIn = (file) => {
  if (file.metadata.src) {
    return (
      <tr>
        <td>Appears in:</td>
        <td><PostName id={ file.metadata.src } /></td>
      </tr>
    )
  }
}

const handleDelete = (file) => {
  deleteFile(file._id)
}



const renderImage = (isImage, link) => {
  if(isImage) {
    return (
      <Thumbnail href={ link } src={ link } />
    )
  }
}

export const File = ( props ) => {

  let file = props.file;
  let baseUrl = Files.baseURL;
  let link = `${baseUrl}/${file.md5}`;
  let size = getReadableFileSizeString(file.length);
  let contentType = file.contentType;
  let isImage = isTypeImage(contentType);
  let params = props.params;

  // console.log(file)

  return (
    <ListGroupItem key={ file._id }>
      <Row>
        <Col xs={ 8 } sm={ 10 }>
          <table className='file-table'>
            <tbody>
              <tr>
                <td>Name:</td>
                <td><a href={ link }>{ file.filename }</a></td>
              </tr>
              <tr>
                <td>Size:</td>
                <td>{ size }</td>
              </tr>
              <tr>
                <td>Type:</td>
                <td>{ contentType } { (isImage) ? ' (image)' : '' }</td>
              </tr>
              <tr>
                <td>Owner:</td>
                <td>{ file.metadata.username }</td>
              </tr>
              { renderAppearsIn(file) }
            </tbody>
          </table>
           
          <Button
            bsStyle="danger"
            onClick={ handleDelete.bind(this, file) }>
            Delete
          </Button>
        </Col>
        <Col xs={ 4 } sm={ 2 }>
          { renderImage(isImage, link) }
        </Col>
      </Row>
    </ListGroupItem>
)};


File.propTypes = {
  file: React.PropTypes.object,
};

