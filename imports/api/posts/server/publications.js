import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts';


// get all posts
Meteor.publish('posts', () => Posts.find());

// get all public posts (used to display posts on the homepage)
Meteor.publish('postsIndex', () => Posts.find( { published: true } ));

// get all posts by tag
Meteor.publish('tagsIndex', ( tag ) => {
  check( tag, String );
  return Posts.find( { published: true, tags: { $in: [ tag ] } } );
});

// get one post by slug (used to access an individual post through the url slug)
Meteor.publish( 'singlePost', ( postSlug ) => {
  check( postSlug, String );
  return Posts.find( { slug: postSlug } );
});

// get one post by id (used by the editor to retrieve posts)
Meteor.publish('postById', ( postId ) => {
  check( postId, String );

  return [
    Posts.find( { _id: postId } )
    // Meteor.users.find( {}, { fields: { profile: 1 } } ) // this was in the tutorial, but I'm not sure why we need this
  ];
});
