import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Posts = new Mongo.Collection('Posts');


/*
  https://themeteorchef.com/snippets/using-the-collection2-package/
  supported autoValue() conditions:
  – this.value    Get the current value if it exists
  – this.isInsert Is the operation being performed an insert?
  – this.isUpdate Is the operation being performed an update?
  – this.isUpsert Is the operation being performed an upsert?
  – this.userId   Get access to the currently logged in user’s ID. This is null if the action being performed originated from the server (e.g. we perform an update in a method).
  – this.isFromTrustedCode  

*/
Posts.schema = new SimpleSchema({
  "published": {
    type: Boolean,
    label: "Is this post published?",
    autoValue() { 
      if(this.isInsert) {
        return false; // default post to not be published on insert
      }
    }
  },
  "author": {
    type: String,
    label: "The name of the author of this post",
    autoValue() {
      let user = Meteor.users.findOne( {_id: this.userId } );
      if (user) {
        // template literals, note the backtick ` instead of a ' ; used instead of "user.profile.name.first + ' ' + user.profile.name.last"
        return `${ user.profile.name.first } ${ user.profile.name.last }`
      }
    }
  },
  "updated": {
    type: String,
    label: "The date this post was last updated.",
    autoValue() {
      return ( new Date() ).toISOString();
    }
  },
  "title": {
    type: String,
    label: "The title of this post.",
    defaultValue: "Untitled Post"
  },
  "slug": {
    type: String,
    label: "The slug for this post.",
    autoValue() {
      let slug = this.value,

          // count identical, existing named slugs that's not this one
          existingSlugCount = Posts.find( { _id: { $ne: this.docId }, slug: slug} ).count(),
          // count untitled slugs
          existingUntitledCount = Posts.find( { slug: { $regex: /untitled-post/i } } ).count();

      if ( slug ) {
        return existingSlugCount > 0 ? `${ slug }-${ existingSlugCount + 1} ` : slug;
      } else {
        return existingUntitledCount > 0 ? `untitled-post-${ existingUntitledCount + 1}` : 'untitled-post';
      }
    }
  },
  "content": {
    type: String,
    label: "The content of this post.",
    optional: true
  },
  "tags": {
    type: [ String ],
    label: "The tags of this post.",
    optional: true
  }
});

Posts.attachSchema(Posts.schema);


/* added for extra safeguard */

Posts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Posts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

