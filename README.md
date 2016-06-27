# React Base Alternate
An (alternate) starting point for Meteor apps

## Building a Blog with React

This is a personal exercise and attempt to rewrite the tutorial on TheMeteorChef called [Building a Blog With React](https://themeteorchef.com/recipes/building-a-blog-with-react/) to be compatible with React Router and Base v4.2.0.

These changes mean using React Router instead of Flow Router, Komposer containers, replacing the use of Mixins with Imports, using Base 4's newer way of organizing files, and so on.

Base 4 is significantly simpler and better organized, but the way some files are named can be confusing, so I've tried to improve the naming experience.


### Images

I also added file and image handling to this base tutorial, since images and files popular with blogs. Although one could use something like the Imgur API, I wanted to experiment with a fully native experience through the use of [file-collection](https://atmospherejs.com/vsivsi/file-collection) and gridFS.






## Todo

– add a server / data / publication / methods "documentation"
– draw the current "import" file tree in ReadMe
– handle file upload disconnects (handle resume, or handle garbage collection on componentWillMount() )
– add copious amounts of inline comments explaining every line (for others and your future self)
– rename files to make more sense
  – add file and posts structure to the map
  – improve naming convention (e.g. posts-list is for authenticated posts, but file name doesn't reflect this)
  – see if it makes any sense to move some stuff around or rename files to make more sense (api/posts/... for example don't have a base include file to organize everything) – make more human readable
– organized SCSS naming scheme that matches new file component structure
– a way to document component file relationships 
– finish up the writeup into markdown
– make more readable, and upload to github
– post on MeteorChef 
  – make a note in the original thread comments
– make a note on vsivsi:file-collection github issue #77 on how I handled garbage collection
  – see if I did it right / get tips from them (re: no resumable uploads, garbage collect user's resumables by uniqueId)

### Done
– add Bert to file upload and delete
– add upload cancel
– garbage collection of canceled files
– hide signup, since this is only for crew
  – hide the link on nav, hide the oute












Steps / Notes / Walkthrough
-------------------------

Prep
-----
make sure the all the required packages are added
– download meteorchef's base
– npm install
- add speakingurl – meteor add ongoworks:speakingurl
- add commonmark – meteor add themeteorchef:commonmark
– add momentjs – meteor add momentjs:moment


Admin Setup
----
– We need to manually set up all the users, since this is a private blog, and /signup is turned off in routes
– users added to /startup/server/fixtures.js
– change the Application Name to HD Buff
– change Navigation title to HD Buff, remove Signup from public navigation


Routing & Authentication
----
– no need to split in authentication in React Router

– Styling
  – added some minor styling into the base application.scss file
    – .post styling for public post list
    – taller textarea for edit page

– App.js
  – break out header navigation
  – requireAuth takes care of auth flow routing
  – note the default Base 4 behavior routes to /login, then routes back to the intended location, which is slightly different than the tutorial behavior where the <Login /> component is dropped in if the user's not authenticated
  – also realize that in Base 4, every route is public by default. We have to add requireAuth to every private route
  – added Meteor component to show Loading state if user is logging in
  – extracted proptypes outside of the component (to be more similar to the other components)

– Public routes
  – /
    – index, show all posts directly through Posts list, without a "homepage"
    – <PostsIndex />
  – /posts/:slug
    – singlePost, show an individual post using its slug
  – /tags/:tag
    – tagIndex, show all posts by a tag, again using only the PostsIndex component
    – <PostsIndex />
  – /signup 
    – removed from Base since we're hard coding all accounts since this is a private blog
  – /login
    – funny enough, if the /tags/:tag line is about login, /tags/login will resolve to the login screen

– Authenticated routes
  – /posts
    – for editing posts,
    – <PostsList />
  – /posts/:_id/edit
    – editing individual post
    – <Editor />
  – added authRedirect component to routes to redirect logged in users to /posts

– Posts schema
  – added stricter Posts allow / deny rules to posts.js
  – 

– Displaying Posts
  – 'Posts' has been added as a page for displaying posts
  – 'PostsList' has been changed to a module
  – 'posts-list' komposer container has been added
  – note that "linked" has been removed, as every element resolves to "linked"

  – map returned posts with more data like the tutorial though
  – not a fan of mapping returned posts to an array and add uid, href and label like in the getMeteorData in the posts-list.jsx part of the tutorial 
    – this convolutes the code. instead, we used the container merely to access the Post
    – instead should use the PostsLists to break out all that info 

– Adding Posts
  – decided against using an add-post component and put all logic in posts.js for a new post

– Editor
  – we get the postID from the react router, get it from the page as a parameter, then pass it into the post-edit.js 
  – renamed editor subscription from 'editor' to 'postById'
  – use FormControl for the editor pagedata container
  – post-edit.js: decided to leave post-edit calls together with the post-edit form
    – uses login.js way of validating, getting input values
    – PostEdit can't be stateless, so we use ES6 syntax to extend React.Component
  – new post method called updatePost takes an object post, validates if object
  – define the calculations within render() instead of using a ton of helper functions for readability
  – note on setting by ref and setting using state
  – added an update.js module to handle post edit updating;
  – added an ischecked function to the get-input-value file
  – added stricter validation schema for upsert

– Post Index
  – added posts-index.js
  – added a public-posts.js container
  – added a public-posts.js UI component
  – added a post.js component for both the post index and individual posts
    – note: when generating tags, I'm checking for "if (tags[0])" since the code will generate empty arrays if tags don't exist

– Post
  – added an if statement to prevent post body from displaying in post list






## Add-on: Handling Images

I also added file and image handling to this base tutorial, since images and files popular with blogs. Although one could use something like the Imgur API, I wanted to experiment with a fully native experience through the use of [file-collection](https://atmospherejs.com/vsivsi/file-collection) and gridFS.

Goal: Add user-uploaded header images to each blog post, and a files list

* add file-collection `meteor add vsivsi:file-collection`
* add jquery cookie `meteor add benjaminrh:jquery-cookie`
* create a new collection
  – update `/startup/server/api.js` with a references to `files` collection – '../../api/files/` ...
  – copy /posts/ into a new /files/ and rename references to files
* new routes
* new /api/
* pages








## Outline
-------------------------

(native meteor)

Notes:
– public, tests, server, clients – are all native meteor runtime folders
– note that /import/ is supported for files dynamically imported
– why are so many files named the same thing?? several files that do very different things are called 'documents'
  – very confusing, and difficult for file search or lookup. Consider renaming to 'documents__page','documents__schema','documents__component'
Server Ideas & Qs:
– why are server things in imports/api when they probably should just remain under /server/ to be more easier found?
  – or rename /api/ to /server/ to denote that these are extensions of the /server/ folder
– maybe create an import-only /documents/index.js (just like /server/ ) – for including all documents related methods and publications?
  – 'documents.js' should really be 'schema.js'
– cut out the /documents/server folder and keep publications on the same level
– special naming for a Mongo Collection is helpful ex: '_Documents' -> export const Documents = new Mongo.Collection('Documents');
– special naming for subscription / publication – __documents instead of documents -> Meteor.publish('documents', () => Documents.find()); const subscription = Meteor.subscribe('documents');
– inconsistency in naming some react components in modules
  – especially handle___ components - component name and file name are different, file name doesn't show it's a support file
  – ex: {handleLogin} is the main component in modules/login.js; login isn't actually an exported function

– React Component types
  – stateless: export const handleLogin = (options) => {
  – React.createClass
    – "old / official" way of creating React classes
  – extend React.Compontent
    – ES6 class
    – needs constructor(props) {super(props);} to handle props
  – special note on React.createClass versus extends React.Component: https://toddmotto.com/react-create-class-versus-component/
    – 

– denotes a same level relationship
> denotes an imported child relationship
< denotes an imported non-child relationship (e.g. completely different folder)

- /public/                                                   ## public images and assets
- /tests/                                                    ## unit tests
– /server/                                                   ## Meteor server runtime
  – ./main.js                                                ## [imports only] used to manage new MongoDB collections
    < /imports/startup/server/index.js                       ## [imports only]
      > /accounts/email-templates.js                         ## email templates (ex: forgot email)
      – fixtures.js                                          ## hardcoded users
      – browser-policy.js                                    ## used for special circumstances, like with amazon
      – api.js                                               ## [imports only] includes for server-side Collection publications and methods
        < /imports/api/documents/server/publications.js      ## Meteor.publish('documents', ...)
          < ../documents.js                                  ## schema for documents
        < /imports/api/documents/methods.js                  ## methods (like inserting, deleting) for documents
          > documents.js                                     ## schema
        < /imports/api/posts/server/publications.js          ## Meteor.publish('posts', ...)
          < ../posts.js                                      ## schema
        < /imports/api/posts/methods.js
          > posts.js                                         ## schema



CLIENT SIDE

Layout      – a template with elements that exist across many pages
Pages       – a page that renders info, possibly with containers and components
Container   - a komposer wrapper for componens that gives Meteor data access
Components  – a React partial that renders info, possibly data

– /client/                                                  ## Meteor client runtime'
  – stylesheets                                             ## .scss for the entire site
  – main.html                                               ## main static html. contains <div id="react-root"> that routes.js renders off of
  – main.js                                                 ## [imports only] main client-side runtime
    < /imports/startup/client/index.js                      ## { Bert } defines app-level imports like Bert and bootstrap
      - routes.js                                           ## react router routes
        < /imports/ui/layouts/app .js                       ## { App } acts as the general layout for everything
          < /imports/ui/containers/app-navigation.js        ## { AppNavigation } general navigation, determines if public or authenticated
            – public-navigation.js                          ## { PublicNavigation}
            – authenticated-navigation.js                   ## { AuthenticatedNavigation }
        < /imports/ui/pages/documents.js                    ## { Documents } Combines onto one page add-documents and documents-list 
          < /imports/ui/containers/documents-list.js        ## data container for DocumentsList
            < /api/documents/documents.js                   ## Documents schema
            < /imports/ui/components/loading.js             
            < /imports/ui/components/documents-list.js      ## { DocumentsList } Displays documents in a list
              – document.js                                 ## { Document } Each individual document in the documents list
                < /api/documents/methods.js                 ## { updateDocument, removeDocument } methods to update the documents collection
          < /imports/ui/components/add-document.js';        ## { AddDocument } component for adding a doc
            < /imports/api/documents/methods.js

        < /imports/ui/pages/posts.js                        ## { Posts } [unfinished]
        < /imports/ui/pages/editor.js                       ## { Editor } [unfinished]

        < /imports/ui/pages/posts-index.js                  ## { PostsIndex }
        < /imports/ui/pages/login.js                        ## { Login } contains the login forms
          < /imports/modules/login.js                       ## { handleLogin } (stateless) validation of login forms
            – get-input-value.js                            ## { getInputValue } very handy reusable module to get the refs from forms
        
        < /imports/ui/pages/single-post.js                  ## { SinglePost }
        < /imports/ui/pages/not-found.js                    ## { NotFound } 404 page
        < /imports/ui/pages/recover-password.js             ## { RecoverPassword } 404 page
          < /imports/modules/recover-password.js            ## { handleRecoverPassword } Signup and user processing
            – get-input-value.js                            ## { getInputValue } very handy reusable module to get the refs from forms
        < /imports/ui/pages/reset-password.js               ## { ResetPassword } 404 page
          < /imports/modules/reset-password.js              ## { handleResetPassword } Signup and user processing
        < /imports/ui/pages/signup.js                       ## { Signup } Signup forms
          < /imports/modules/signup.js                      ## { handleSignup } Signup and user processing
            – get-input-value.js                            ## { getInputValue } very handy reusable module to get the refs from forms





<table>
  <tbody>
    <tr>
      <th>Base Version</th>
      <td>v4.2.0</td>
    </tr>
    <tr>
      <th>Meteor Version</th>
      <td>v1.3.2.4</td>
    </tr>
  </tbody>
</table>

[Read the Base Documentation](http://themeteorchef.com/base)
