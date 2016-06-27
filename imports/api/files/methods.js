import $ from 'jquery';
import { Files } from './files';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Bert } from 'meteor/themeteorchef:bert';

/*
  Much of this code was translated from the coffeescript example from
  vsivsi:file-collection which you can find: https://github.com/vsivsi/meteor-file-collection

  There's a garbage collection bug in file-collection where aborted / canceled files don't get cleaned up properly
  that I handle here
*/

/*
    don't run the file methods through validator and schema
    – we rely on FileCollection to do all that work
*/

// This assigns a file upload drop zone to some DOM node
export const assignDrop = (target) => {
  Files.resumable.assignDrop($(target));
}

// This assigns a browse action to a DOM node
export const assignBrowse = (target) => {
  Files.resumable.assignBrowse($(target));
}

export const deleteFile = (fileId) => {
  // console.log('deleting file: ' + fileId)
  Files.remove({_id: fileId});
}

// collection.remove({ $or: [{ "length": 0 }, { "metadata._Resumable": { $exists: true } }] });

// deletes all resumable partials and 0 size files from Files (bug #77 – file-collection doesn't do this)
export const cleanAll = () => {
  // match userId (we can't delete other people's partially uploaded files!)
  // => then match length = 0, match metadata._Resumable exists
  console.log('collecting garbage');
  let garbage = Files.find( { $and:  [
                                        {"metadata.owner": Meteor.userId()},
                                        {$or: [{ "length": 0 }, { "metadata._Resumable": { $exists: true } }] },
                                      ]
                            }).fetch();
  console.log('clean up garbage...');
  console.log(garbage)

  garbage.forEach(function(item) {
    console.log('deleting: ')
    console.log(item)
    deleteFile(item._id);
  });

}

// deletes resumable partials and 0 size files from a given id Files (bug #77 – file-collection doesn't do this)
export const cleanOne = (fileId) => {

}

// called externally (from add-file.js)
export const stopUpload = (fileId) => {
  let file = Files.resumable.getFromUniqueIdentifier(fileId);
  // Files.resumable.removeFile(file);
  cancelUpload(file);
}

// aborts and cleans up
export const cancelUpload = (file) => {

  console.warn (`cleaning up canceled upload: ${file.uniqueIdentifier}`);
  // console.log(Files.resumable)
  // console.log(file)

  // – aborts the Files.resumable upload
  // Files.resumable.cancel();
  Files.resumable.removeFile(file);
  Files.remove({_id: file.uniqueIdentifier});
  // cleanAll();
  // Files.cleanup(file.uniqueIdentifier);
}

// tracks file handling (uploading and status) state using resumable
// can reactively set status through the component argument's setState (make sure component has a constructor and proper state variables)
export const handleUpload = (component) => {
  // When a file is added, createa a new file in the Collection
  Files.resumable.on('fileAdded', function (file) {

    let username = `${Meteor.user().profile.name.first} ${Meteor.user().profile.name.last}`;

    let metadata = {
      username: username
    };

    if(component.props.src) {
      metadata['src'] = component.props.src;
    }


    // Create a new file in the file collection to upload
    Files.insert({
      _id: file.uniqueIdentifier,  // This is the ID resumable will use
      filename: file.fileName,
      contentType: file.file.type,
      metadata: metadata
      },
      function (err, _id) {  // Callback to .insert
        if (err) { return console.error("File creation failed!", err); }
        // Once the file exists on the server, start uploading
        Files.resumable.upload();
      }
    );
  });


  // Update the upload progress via component state variable
  Files.resumable.on ('fileProgress', function (file) {
    let sessions = component.state.sessions;
    // resumable doesn't have a "onCancel" so we need to check if the object's been canceled
    // instead of directly calling a function to reset the status and call cancelUpload,
    // a flag is added to 'skip' aborted files from continuing its upload, since this
    // function will still be running in the background as a reset function is called, potentially
    // competing with the reset function.
    if (sessions[file.uniqueIdentifier]) {
      if(sessions[file.uniqueIdentifier].aborted) {
        // if the current file is aborted, abort and clean up the upload 
        // this might also get called more than once, since it seems like resumable.removeFile doesn't trigger immediately
        // to cancel the fileProgress event for this file
        // cancelUpload(file);
        return 0; // escape the loop so we stop updating the file progress
      }
    }

    sessions[file.uniqueIdentifier] = {
      filename: file.fileName,
      progress: Math.floor(100*file.progress())
    };
    // console.log('fileProgress setstates')
    component.setState({sessions: sessions});
  });

  // Not very robust
  Files.resumable.on ('fileError', function (file) {
    console.warn("Error uploading ", file.uniqueIdentifier);
    Bert.alert(`Error uploading: ${ file.fileName }`, 'warning');
  });


  // Clear the state variable
  Files.resumable.on ('catchall', function (event, file) {
    // Bert.alert(`File uploaded: ${ file.fileName }`, 'success');
    // console.log('catch all: ' + event)
    // console.log(file)
  });

  // Clear the state variable
  Files.resumable.on ('fileSuccess', function (file) {
    Bert.alert(`File uploaded: ${ file.fileName }`, 'success');
  });

  Files.resumable.on ('complete', function (file) {
      console.log('Resumable complete.')
      cleanAll();
  });

  Files.resumable.on ('cancel', function (file) {
      console.log('cancel event')
      cleanAll();
  });

}


