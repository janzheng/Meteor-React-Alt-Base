import { composeWithTracker } from 'react-komposer';
import { Files } from '../../api/files/files.js';
import { cookie } from 'meteor/ongoworks:speakingurl';
import { Posts } from '../../api/posts/posts.js';
import { Post } from '../components/post.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {

  // Sending userId prevents a race condition
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });
  const dataSubscription = Meteor.subscribe('allData');

  const subscription = Meteor.subscribe('singlePost', params.slug);

  if (subscription.ready() && dataSubscription.ready()) {
    const post = Posts.findOne( { slug: params.slug } );
    const file = Files.findOne( { "metadata.src": post._id} );
    onData(null, { post, file });
  }
};

export default composeWithTracker(composer, Loading)(Post);
