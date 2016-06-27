import { composeWithTracker } from 'react-komposer';
import { Posts } from '../../api/posts/posts.js';
import { PostName } from '../components/postname.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('postById', params.id);

  if (subscription.ready()) {
    const post = Posts.findOne( { _id: params.id } );
    onData(null, { post });
  }
};

export default composeWithTracker(composer, Loading)(PostName);
