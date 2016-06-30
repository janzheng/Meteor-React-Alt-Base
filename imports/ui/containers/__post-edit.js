
/*

    Container for PostEdit
    – Edit an existing, individual post

*/

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { cookie } from 'meteor/ongoworks:speakingurl';

import { Files } from '../../api/files/collection';
import { Posts } from '../../api/posts/collection';

import { PostEdit } from '../components/post-edit';
import { Loading } from '../components/loading';

const composer = (params, onData) => {

  let userId = Meteor.userId();

  const subscription = Meteor.subscribe('singlePostById', params.id);

  // Sending userId prevents a race condition
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });
  const dataSubscription = Meteor.subscribe('allDataChunks');

  // console.log('post-edit loading');
  // console.log(subscription);
  // console.log(dataSubscription);

  // if (subscription.ready() && dataSubscription.ready()) {

  if (subscription.ready() && dataSubscription.ready()) {
    // console.log('post-edit ready');
    const post = Posts.findOne( { _id: params.id } );
    const file = Files.findOne( { $and: [{ "metadata.src": params.id}, { "length": {$ne: 0} }, { "metadata._Resumable": { $exists: false } }] } );


    // const post = Posts.find().fetch().map( ( post ) => {
    //     post: Posts.findOne( { _id: params.id } )
    //   });
    onData(null, { post, file });
  }
};



export default composeWithTracker(composer, Loading)(PostEdit);
