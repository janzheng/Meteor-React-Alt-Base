import React from 'react';
import { Post } from '../components/post.js';
import { Alert } from 'react-bootstrap';


export const PublicPosts = ({ posts }) => {
  console.log(posts.singlePost)
  return (
    posts.length > 0 ? <div className="posts-list">
      {posts.map((post) => (
        <Post key={ post._id } post={ post }></Post>
      ))}
    </div> :
    <Alert bsStyle="warning">No posts found.</Alert>
)};

PublicPosts.propTypes = {
  posts: React.PropTypes.array,
};
