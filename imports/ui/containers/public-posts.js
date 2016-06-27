import { composeWithTracker } from 'react-komposer';
import { Posts } from '../../api/posts/posts.js';
import { PublicPosts } from '../components/public-posts.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  let subscription;

  if (params.tag)
    subscription = Meteor.subscribe('tagsIndex', params.tag);
  else 
    subscription = Meteor.subscribe('postsIndex');
  if (subscription.ready()) {
    const posts = Posts.find().fetch();
    onData(null, { posts });
  }
};

export default composeWithTracker(composer, Loading)(PublicPosts);
