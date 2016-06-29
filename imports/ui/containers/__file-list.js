
/*

    Container for FilesList
    – Display a list of Files

*/

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { cookie } from 'meteor/ongoworks:speakingurl';

import { Files } from '../../api/files/collection.js';

import { FileList } from '../components/file-list.js';
import { Loading } from '../components/loading.js';

const composer = (params, onData) => {
  
  // Sending userId prevents a race condition
  let userId = Meteor.userId();
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });

  // even resumable chunks and 0 length / just added files for debugging
  const subscription = Meteor.subscribe('allDataChunks'); 

  if (subscription.ready()) {
    const files = Files.find({ $and: [{ "length": {$ne: 0} }, { "metadata._Resumable": { $exists: false } }] }).fetch();
    // const files = Files.find().fetch();

    onData(null, { files });
  }
};

export default composeWithTracker(composer, Loading)(FileList);




