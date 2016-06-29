
/*
    Displays the post title and a link to the post
    – used by the files list
*/

import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router';

export const PostName = ( props ) => {

  let post = props.post;
  let params = props.params;

  return (
    <span className="postname">
      <Link to={'/posts/' + post.slug }>{post.title}</Link>
    </span>
)};