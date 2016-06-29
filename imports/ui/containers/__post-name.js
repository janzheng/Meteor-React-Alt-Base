
/*

    Container for PostName
    – Edit an existing, individual post

*/

import { composeWithTracker } from 'react-komposer';
import { Posts } from '../../api/posts/collection';
import { PostName } from '../components/post-name';
import { Loading } from '../components/loading';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('singlePostById', params.id);

  if (subscription.ready()) {
    const post = Posts.findOne( { _id: params.id } );
    onData(null, { post });
  }
};

export default composeWithTracker(composer, Loading)(PostName);
