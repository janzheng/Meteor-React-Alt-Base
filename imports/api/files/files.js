import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FileCollection } from 'meteor/vsivsi:file-collection';

export const Files = new FileCollection('files', // collection name affects url
  { resumable: true,   // Enable built-in resumable.js upload support
    resumableIndexName: 'files',  // Don't use the default MongoDB index name, which is 94 chars
    http: [
      { method: 'get',
        path: '/:md5',  // this will be at route "/gridfs/files/:md5"
        lookup: function (params, query) {  // uses express style url params
          return { md5: params.md5 };       // a query mapping url to myFiles
        }
      }
    ]
  }
);
