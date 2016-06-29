import { composeWithTracker } from 'react-komposer';
import { Files } from '../../api/files/files.js';
import { cookie } from 'meteor/ongoworks:speakingurl';
import { Posts } from '../../api/posts/posts.js';
import { PostEdit } from '../components/post-edit.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {

  let userId = Meteor.userId();

  const subscription = Meteor.subscribe('postById', params.id);

  // Sending userId prevents a race condition
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });
  const dataSubscription = Meteor.subscribe('allChunks');


  console.log('post-edit loading');
  console.log(subscription);
  console.log(dataSubscription);

  // if (subscription.ready() && dataSubscription.ready()) {

  if (subscription.ready() && dataSubscription.ready()) {
    console.log('post-edit ready');
    const post = Posts.findOne( { _id: params.id } );
    const file = Files.findOne( { "metadata.src": params.id} );


    // const post = Posts.find().fetch().map( ( post ) => {
    //     post: Posts.findOne( { _id: params.id } )
    //   });
    onData(null, { post, file });
  }
};



export default composeWithTracker(composer, Loading)(PostEdit);
