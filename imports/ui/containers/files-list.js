import { composeWithTracker } from 'react-komposer';
import { Files } from '../../api/files/files.js';
import { FilesList } from '../components/files-list.js';
import { Loading } from '../components/loading.js';
import { cookie } from 'meteor/ongoworks:speakingurl';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  
  // Sending userId prevents a race condition
  let userId = Meteor.userId();
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });

  // const subscription = Meteor.subscribe('allData');
  const subscription = Meteor.subscribe('allChunks'); // even resumable chunks and 0 length / just added files for debugging

  if (subscription.ready()) {
    const files = Files.find({ $and: [{ "length": {$ne: 0} }, { "metadata._Resumable": { $exists: false } }] }).fetch();
    // const files = Files.find().fetch();

    // console.log('Composer files array: ')
    // console.log(files);
    onData(null, { files });
  }
};

export default composeWithTracker(composer, Loading)(FilesList);




