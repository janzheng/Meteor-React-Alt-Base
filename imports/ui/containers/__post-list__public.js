
/*

    Container for PublicPosts
    – displays a list of posts, either all published posts or by tag

*/

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

import { Posts } from '../../api/posts/collection';

import { PostList__Public } from '../components/post-list__public.js';
import { Loading } from '../components/loading.js';

const composer = (params, onData) => {
  let subscription;

  if (params.tag)
    subscription = Meteor.subscribe('publishedPostsByTag', params.tag);
  else 
    subscription = Meteor.subscribe('publishedPosts');
  if (subscription.ready()) {
    const posts = Posts.find().fetch();
    onData(null, { posts });
  }
};

export default composeWithTracker(composer, Loading)(PostList__Public);
