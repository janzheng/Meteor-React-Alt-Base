
/*

    Helpers for Handling Files

*/

import { Files } from '../api/files/collection.js';

//http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
export const getReadableFileSizeString = (fileSizeInBytes) => {
  let i = -1;
  let byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

export const isTypeImage = (contentType) => {
  let types = {
                'image/jpeg': true,
                'image/png': true,
                'image/gif': true,
                'image/tiff': true,
              }
  return (typeof types[contentType] === 'undefined') ? false : true;
}

export const getFileURL = (file) => {
  let baseUrl = Files.baseURL;
  return `${baseUrl}/${file.md5}`;
}