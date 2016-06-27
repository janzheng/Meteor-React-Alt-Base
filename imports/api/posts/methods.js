import { Posts } from './posts';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const newPost = new ValidatedMethod({
  name: 'posts.insert',
  validate: new SimpleSchema({
    // nothing to validate
  }).validator(),
  run() {
    return Posts.insert( {} );
  },
});


export const updatePost = new ValidatedMethod({
  name: 'posts.update',
  validate: new SimpleSchema({
    _id: { type: String },
    title: { type: String },
    slug: { type: String },
    content: { type: String, optional: true },
    published: { type: Boolean },
    tags: { type: [String], optional: true }
  }).validator(),
  run(post) {
    let postId = post._id;
    delete post._id;

    Posts.upsert( postId, { $set: post } );
  },
});

