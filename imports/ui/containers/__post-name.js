
/*

    Container for PostName
    – Edit an existing, individual post

*/

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { Loading } from '../components/loading';

import { Posts } from '../../api/posts/collection';
import { PostName } from '../components/post-name';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('singlePostById', params.id);

  if (subscription.ready()) {
    const post = Posts.findOne( { _id: params.id } );
    onData(null, { post });
  }
};

export default composeWithTracker(composer, Loading)(PostName);
