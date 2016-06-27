import $ from 'jquery';
import 'jquery-validation';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { getInputValue, getIsChecked } from './get-input-value';
import { updatePost } from '../api/posts/methods.js';

let postEdit;

const update = () => {
  let post = {
    _id: postEdit.props.post._id,
    title: getInputValue(postEdit.refs.postTitle),
    slug: getInputValue(postEdit.refs.postSlug),
    content: getInputValue(postEdit.refs.postContent),
    published: getIsChecked(postEdit.refs.postPublished),
    tags: getInputValue(postEdit.refs.postTags).split( ',' ).map( ( string ) => {
      return string.trim();
    })
  };

  updatePost.call( post, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Post saved!', 'success');
      }
    });

};

const validate = () => {
  $(postEdit.refs.updateForm).validate({
    rules: {
      postTitle: {
        required: true,
      },
    },
    messages: {
      postTitle: {
        required: "Hang on there, a post title is required!"
      },
    },
    submitHandler() { update() },
  });
};


export const handleUpdate = (props) => {
  postEdit = props.postEdit;
  validate();
};
