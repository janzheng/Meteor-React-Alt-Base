import { Meteor } from 'meteor/meteor';
import { Files } from '../collection';

// we need to explose all chunks to the client instead of just the data for garbage collection
Meteor.publish('allDataChunks', () => Files.find({}));

// all files (excluding chunks and file headers)
Meteor.publish('allFiles', () => Files.find({$and: [{ "length": {$ne: 0} }, { "metadata._Resumable": { $exists: false } }] }));


// Allow rules for security. Without these, no writes would be allowed by default
Files.allow({

  // Assign the proper owner when a file is created 
  insert: (userId, file) => {
    file.metadata = file.metadata || {};
    file.metadata.owner = userId;
    return true;
  },
  remove: function (file) {
    // Only owners can delete:
    // return (userId === file.metadata.owner);
    // we trust all admins to delete responsibly, since this is a locked environment
    return true;
  },
  // Only owners can retrieve a file via HTTP GET
  read: function (userId, file) {
    // return (userId === file.metadata.owner);
    return true
  },
  // This rule secures the HTTP REST interfaces' PUT/POST
  // Necessary to support Resumable.js
  write: function (userId, file, fields) {
    // Only owners can upload file data
    return (userId === file.metadata.owner);
  }

});
