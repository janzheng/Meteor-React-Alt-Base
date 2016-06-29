
/*

    Container for PublicPosts
    – displays a list of posts, either all published posts or by tag
    – (this logic is taken care of in the data container)

*/

import React from 'react';
import { Post__Public } from '../components/post__public.js';
import { Alert } from 'react-bootstrap';


export const PostList__Public = ({ posts }) => {
  console.log(posts.singlePost)
  return (
    posts.length > 0 ? <div className="posts-list">
      {posts.map((post) => (
        <Post__Public key={ post._id } post={ post } />
      ))}
    </div> :
    <Alert bsStyle="warning">No posts found.</Alert>
)};

PostList__Public.propTypes = {
  posts: React.PropTypes.array,
};
