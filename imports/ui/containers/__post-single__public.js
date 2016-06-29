
/*

    Container for Post (as a single post)
    – Display a single post from a slug

*/

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { cookie } from 'meteor/ongoworks:speakingurl';

import { Files } from '../../api/files/collection.js';
import { Posts } from '../../api/posts/collection.js';

import { Post__Public } from '../components/post__public';
import { Loading } from '../components/loading';
const composer = (params, onData) => {

  const subscription = Meteor.subscribe('singlePost', params.slug);

  // Retrieves file information associated to the post (e.g. images)
  // Sending userId prevents a race condition
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });
  const dataSubscription = Meteor.subscribe('allFiles');

  if (subscription.ready() && dataSubscription.ready()) {
    const post = Posts.findOne( { slug: params.slug } );

    // only get one file with this post's ID (this is set on upload through post edit)
    const file = Files.findOne( { "metadata.src": post._id} );
    onData(null, { post, file });
  }
};

export default composeWithTracker(composer, Loading)(Post__Public);
