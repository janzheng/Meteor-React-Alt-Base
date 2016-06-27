import { composeWithTracker } from 'react-komposer';
import { Posts } from '../../api/posts/posts.js';
import { PostsList } from '../components/posts-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('posts');
  if (subscription.ready()) {
    const posts = Posts.find().fetch().map( ( post ) => {
        return { uid: post._id, href: `/posts/${ post._id }/edit`, label: post.title };
      });
    onData(null, { posts });
  }
};

export default composeWithTracker(composer, Loading)(PostsList);
