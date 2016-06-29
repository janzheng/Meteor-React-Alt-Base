
/*

    Container for PostsList
    – Displays a list of posts for authenticated users (to edit)

*/

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

import { Posts } from '../../api/posts/collection';

import { Loading } from '../components/loading';
import { PostList__Auth } from '../components/post-list__auth';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('allPosts');
  if (subscription.ready()) {
    const posts = Posts.find().fetch().map( ( post ) => {
        return { uid: post._id, href: `/posts/${ post._id }/edit`, label: post.title };
      });
    onData(null, { posts });
  }
};

export default composeWithTracker(composer, Loading)(PostList__Auth);
