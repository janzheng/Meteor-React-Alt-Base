import React from 'react';

// import ReactDOM from 'react-dom'; // refer to the note 
import { FormGroup, FormControl, ControlLabel, Button, Checkbox, Alert, Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { moment } from 'meteor/momentjs:moment';
import { getSlug } from 'meteor/ongoworks:speakingurl';
import { getFileURL } from '../../modules/helpers';

// file handling
import { AddFile } from '../components/add-file.js';
import { deleteFile } from '../../api/files/methods.js';

// Update Handler
import { handleUpdate } from '../../modules/update';
// import { updatePost } from '../../api/posts/methods.js';


// export const PostEdit = ({ post }) => ( // we're using states and refs, so PostEdit can't be stateless :(
export class PostEdit extends React.Component {

  constructor(props) {
    super(props);
    let post = props.post;
    let file = props.file;

    this.state = {
      slug: post && post.slug // calculate initial value of slug as a state value
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateSlug = this.generateSlug.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    handleUpdate({ postEdit: this });
  }

  handleSubmit( event ) {
    event.preventDefault();
    // handleUpdate({ postEdit: this });
  }

  generateSlug( event ) {
    let slug = getSlug(event.target.value);
    this.setState({slug: slug});

    // Note: Setting values by ref vs. using state
    // – according to the docs, reactively setting values by ref is bad form
    //   since we're bypassing data reactivity.
    // – to set the value using state, we have to setup a constructor, pass the props in, 
    //   and set an initial value for the state.slug value.
    //   We then use this value to set the calculated slug
    // – note that _it is ALSO bad form_ to convert all props into state values
    //   state values are only supposed to use with Component-specific calculated values
    //   in this case, the slug is calculated from the prop post.title

    // – to set by ref, we set a string ref on the FormControl
    // ReactDOM.findDOMNode(this.refs.slugRef).value = slug
  }


  handleDelete() {
    console.log('handle delete triggered')
    let file = this.props.file;
    deleteFile(file._id)
  }

  renderImage() {
    let file = this.props.file;
    if (file) {
      let link = getFileURL(file);
      console.log('render image url: ' + link)

      return (
        <div>
          <Thumbnail href={ link } src={ link } ></Thumbnail>
          <Button
            className="post-remove-image"
            bsStyle="default"
            onClick={ this.handleDelete }>
            Remove Image
          </Button>
        </div>
      );
    } else {
      return <div className="margin-bottom" ><AddFile src={ this.props.post._id } title="Add an Image" /></div>;
    }
  }

  render() {
    let post = this.props.post;
    
    let updatedDate = moment( post.updated ).format( 'MMMM Do, YYYY hh:mm a' ),
        tags = post && post.tags ? post.tags.join( ', ' ) : null;

    console.log('post-edit rendering');
    
    // reminder that data loading is handled in the komposer container

    return (
      <div>
        <Alert>Editing: { post.title }</Alert>
        <form ref="updateForm" className="updateForm" onSubmit={ this.handleSubmit }>
          <p className="updated-date">
            <strong>Last Updated:</strong> { updatedDate } by { post.author }
          </p>
          <FormGroup>

            <Checkbox 
              name="postPublished"
              ref="postPublished"
              defaultChecked={ post && post.published }
              >
              Published?
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <FormControl
              type="text"
              name="postTitle"
              ref="postTitle"
              label="Title"
              onChange={ this.generateSlug }
              defaultValue={ post && post.title }
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              disabled={ true }
              type="text"
              name="postSlug"
              ref="postSlug"
              label="Slug"
              value={ this.state.slug }
              // ref="slugRef"
            />
          </FormGroup>
          <FormGroup>
            <FormControl 
              componentClass="textarea" 
              name="postContent"
              ref="postContent"
              placeholder="Type your post content"
              defaultValue={ post && post.content }
              />
          </FormGroup>
          <FormGroup controlId="formControlsTags">
            <FormControl
              type="text"
              name="postTags"
              ref="postTags"
              label="Tags"
              placeholder="Enter tags separated by commas"
              defaultValue={ tags }
            />
          </FormGroup>
          { this.renderImage() }
          <FormGroup>
            <Button type="submit" bsStyle="success">Save Post</Button>
          </FormGroup>
        </form>
      </div>
    );
  }
};

PostEdit.propTypes = {
  post: React.PropTypes.object,
};

