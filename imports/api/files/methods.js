import $ from 'jquery';
import { Files } from './collection';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Bert } from 'meteor/themeteorchef:bert';

/*
    Much of this code was translated from the coffeescript example from
    vsivsi:file-collection which you can find: https://github.com/vsivsi/meteor-file-collection

    There's a garbage collection bug in file-collection where aborted / canceled files 
    don't get cleaned up properly, so some of the garbage collection is handled here

    Note that I don't properly clean for when a connection has been canceled 

    Also note that I don't run the file methods through a validator and schema,
    since I can rely on FileCollection to do that work
*/



/*
    External Methods
*/

// This assigns a file upload drag & drop zone to some DOM node
export const assignDrop = (target) => {
  Files.resumable.assignDrop($(target));
}

// This assigns a browse action to a DOM node ('upload' button)
export const assignBrowse = (target) => {
  Files.resumable.assignBrowse($(target));
}

export const deleteFile = (fileId, trash) => {
  if (trash) console.log('removing trash: ' + fileId)
  Files.remove({_id: fileId});
}

// deletes all resumable partials and 0 size files from Files 
// (bug #77 – file-collection doesn't do this)
export const cleanAll = () => {
  // match userId (we can't delete other people's partially uploaded files!)
  // => then match length = 0, match metadata._Resumable exists

  // console.log('cleanAll function -------------');

  let garbage = Files.find( { $and:  [
                                        {"metadata.owner": Meteor.userId()},
                                        {$or: [{ "length": 0 }, { "metadata._Resumable": { $exists: true } }] },
                                      ]
                            }).fetch();

  // garbage = Files.find({}).fetch();
  // console.log('clean up garbage...');
  // console.log(garbage)

  // note that we can't delete files directly using Files.find(),
  // so the list of items is returned in a garbage array, and then perform a deleteFile
  // operation for each item in the garbage array
  garbage.forEach(function(item) {
    deleteFile(item._id, true);
  });

}

// called externally (from file-add.js)
export const stopUpload = (fileId) => {
  let file = Files.resumable.getFromUniqueIdentifier(fileId);
  cancelUpload(file);
}

// aborts a single file upload
// cleanup happens after all files have completed upload under the complete event
export const cancelUpload = (file) => {
  console.warn (`Canceling upload for : ${file.uniqueIdentifier}`);
  Files.resumable.removeFile(file); // stops resumable from uploading the file
  Files.remove({_id: file.uniqueIdentifier}); // removes the file stub

  // Wait is necessary since resumable will still run a few cycles after onComplete
  _.delay(cleanAll, 1000);

  // at this point the database will still store the incomplete uploaded partials
  // from this canceled upload. I clean up these partials when all downloads are completed
  // (or canceled)
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

    // 'src' is the postId, added for files added from a post
    // posts will match the src with their postId to display files added specifically for that post 
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

    if(component) {
      let sessions = component.state.sessions;

      // when cancel is called, the event fileProgress won't stop immediately
      // we can check if the aborted flag exists, and if it does, we escape this loop
      // so we can stop updating progress and don't replace the aborted flag
      if (sessions[file.uniqueIdentifier]) {
        if(sessions[file.uniqueIdentifier].aborted) {
          return 0; // escape the loop so we stop updating the file progress
        }
      }
      // set a new session variable with the new state
      // refer to file-add.js to see what this looks like
      sessions[file.uniqueIdentifier] = {
        filename: file.fileName,
        progress: Math.floor(100*file.progress())
      };
      component.setState({sessions: sessions});
    }
    
  });

  // Not very robust
  Files.resumable.on ('fileError', function (file) {
    console.warn("Error uploading ", file.uniqueIdentifier);
    Bert.alert(`Error uploading: ${ file.fileName }`, 'warning');
  });

  // Clear the state variable
  Files.resumable.on ('fileSuccess', function (file) {
    Bert.alert(`File uploaded: ${ file.fileName }`, 'success');
  });


}


