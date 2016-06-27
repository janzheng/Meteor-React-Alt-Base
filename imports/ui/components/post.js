import React from 'react';
import { getFileURL } from '../../modules/helpers';
import { moment } from 'meteor/momentjs:moment';
import { parseMarkdown } from 'meteor/themeteorchef:commonmark';
import { Row, Col, Image } from 'react-bootstrap';

const renderImage = ( file ) => {
  if( file ) {
    let link = getFileURL(file);
    return (
      <Row>
        <Col xs={12}>
          <Image className="post__headerImage" src={ link } responsive />
        </Col>
      </Row>
    )
  } 
};

const getPostTitle = ( post, props ) => {

  if ( props.singlePost ) {
    return <h3>{ post.title }</h3>;
  } else {
    return (
      <h3><a href={ `/posts/${ post.slug }`}>{ post.title }</a></h3>
    )
  }
};

const renderTags = ( post ) => {
  let tags = post.tags;

  if (tags[0]) {
    return (
      <div className="tags">
        {tags.map( (tag, i) => (
            <a key={i} className="tag" href={ `/tags/${ tag }` }>#{ tag }</a>
          )
        )}
      </div>
    )
  }
};

const renderBody = ( post, props ) => {

  let getHTML = ( markdown ) => {
    if ( markdown ) {
      return { __html: parseMarkdown( markdown ) };
    }
  }

  if ( post.content && props.singlePost ) {
    return (
      // <div>{ post.content }</div>
      <div className="post-body" dangerouslySetInnerHTML={ getHTML( post.content ) } />
    )
  }
}

export const Post = ( props ) => {

  let post = props.post;
  let file = props.file
  let params = props.params;

  console.log('single post file ---')
  console.log(file);

  return (
    <div className="post">

      { renderImage( file ) }
      { getPostTitle( post, props ) }
      <p><strong>Last Updated:</strong> { moment( post.updated ).format( 'MMMM Do, YYYY hh:mm a' ) } by { post.author }</p>
      { renderTags( post ) }
      { renderBody( post, props ) }
    </div>
)};