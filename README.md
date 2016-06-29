# React Base Alternate
An (alternate) starting point for Meteor and React.

This is a personal exercise and attempt to rewrite the tutorial on TheMeteorChef called [Building a Blog With React](https://themeteorchef.com/recipes/building-a-blog-with-react/) to use React Router and [Base v4.2.0](https://themeteorchef.com/base/), a system for jumpstarting a Meteor React project.

Please use this project in any way you want: as a learning tool for Meteor, React, or as a starting point for your own projects. Keep in mind that I wrote this as a learning experience, so take it with a grain of salt. 

If you're using this as a learning tool, read [the original tutorial first](https://themeteorchef.com/recipes/building-a-blog-with-react/) and recreate the tutorial in React Router yourself. This form of active learning can be daunting, but really helped me understand both Meteor and React. It'll do you good. I promise.

For amazing tutorials, please check out all the other free resources at [TheMeteorChef](https://themeteorchef.com).



## Building a Blog with React

The major differences from TheMeteorChef tutorial are using React Router instead of Flow Router, Komposer containers, replacing the use of Mixins with Imports, and using Base 4's newer way of organizing files.

Base 4 is significantly simpler and better organized, but the way some files are named can be confusing, so I've tried to improve the naming experience.

Please [email me at hello@janzheng](hello@janzhengs) with suggestions, questions, comments, and bugs

A project by [Jan Zheng](http://janzheng.com)



### Images

I also added file and image handling to this base tutorial, since images and files popular with blogs. Although one could use something like the Imgur API, I wanted to experiment with a fully native experience through the use of [file-collection](https://atmospherejs.com/vsivsi/file-collection) and gridFS.


### Application Structure Organization

Even with Base 4's adherence to the new application structure per the [Meteor Guide](https://guide.meteor.com/structure.html) things get confusing very quickly. I've attempted to alleviate the confusion between file names through file naming conventions, yet still adhering to the Meteor Guide.

To make better sense of how a Meteor + React app is organized, I've attempted to map out the way files include each other. Check out the [App Map & Outline](#appmap).

I also started a way to organize SCSS styling to adhere to React component organization with a BEM-like syntax. Check out the [Styling section](#styling).




## Todo

* add a server / data / publication / methods "documentation"
* draw the current "import" file tree in ReadMe
* handle file upload disconnects (handle resume, or handle garbage collection on componentWillMount() )
* add copious amounts of inline comments explaining every line (for others and your future self)
* rename files to make more sense
    * add file and posts structure to the map
    * improve naming convention (e.g. posts-list is for authenticated posts, but file name doesn't reflect this)
    * see if it makes any sense to move some stuff around or rename files to make more sense (api/posts/... for example don't have a base include file to organize everything) – make more human readable
* organized SCSS naming scheme that matches new file component structure
* a way to document component file relationships 
* finish up the writeup into markdown
* make more readable, and upload to github
* post on MeteorChef 
    * make a note in the original thread comments
* make a note on vsivsi:file-collection github issue #77 on how I handled garbage collection
    * see if I did it right / get tips from them (re: no resumable uploads, garbage collect user's resumables by uniqueId)

### Done

* add Bert to file upload and delete
* add upload cancel
* garbage collection of canceled files
* hide signup, since this is only for crew
    * hide the link on nav, hide the oute









## Walkthrough

This walkthrough assumes you've understood [the original Blog tutorial on the meteor chef](https://themeteorchef.com/recipes/building-a-blog-with-react/), and that you have a decent familiarity with Meteor projects.

This app is at the core very similar to the original tutorial app on TheMeteorChef. The purpose of the walkthrough is to document the overarching steps I took to create this app from Base, as well as the differences and additions to the original tutorial, but is not meant to be an exhaustive tutorial.

The code is also fairly extensively commented to provide clarity.



### Preparation

Make sure you have all the required packages.

1. Initialize a basic meteor project. e.g. `meteor create react-blog`
1. Replace the default meteor folders with [Base](https://themeteorchef.com/base/)
1. Finish installing Base with: `npm install`
1. Add speakingurl: `meteor add ongoworks:speakingurl`
1. Add commonmark: `meteor add themeteorchef:commonmark`
1. Add momentjs: `meteor add momentjs:moment`

### Overview

#### Setting Up Admin Users
Since we're building a private blog, we make sure that `/signup` is unavailable and that we add our admins manually.

* Remove `/signup` from `routes.js` and from `public-navigation.js`
* Manually add users to `/startup/server/fixtures.js`
    * Note that fixtures has been changed to account for user roles (pun!) 
* change the Application title to HD Buff in `/client/main.html` and in the nav `app-navigation.js`


#### Routing & Authentication

Whereas the original tutorial split routing into two folders public and authenticated routes, we have no need for a similar split in React Router. `routes.js` takes care of both public and authenticated routes.

* The `requireAuth` method takes care of auth flow routing in `routes.js`
    * Note the default Base 4 behavior routes to `/login` first, then routes through to the intended location. This behavior differs from the tutorial where <Login /> is a component that appears on a page template for unauthenticated users. I decided to keep the Base 4 behavior for simplicity.
    * added Meteor component to show Loading state if user is logging in
* In Base 4, every route is __public by default__. We have to add `onEnter={ requireAuth }` to every private route. Don't assume that a route is safe just because it doesn't appear in Nav. Always make sure to protect private routes.
* Remember that order matters in routing. Authenticated routes should come before public routes, and the 404 catchall route should be at the end. 

##### Authenticated routes
* `/posts`
    * for posts for editing, and includes unpublished posts
    * `<PostsList />`
* `/posts/:_id/edit`
    * editing an individual post
    * `<Editor />`
  – added authRedirect component to routes to redirect logged in users to /posts

##### Public Routes
* `/`
    * show all posts directly through Posts list, without a "homepage" or landing page
    * `<PostsIndex />`
– `/login`
    * funny enough, if the `/tags/:tag` line is above `login`, `/tags/login` will resolve to the login screen
    * `<Login />`
* `/posts/:slug`
    * readable URLs using the post slug, e.g. blog.com/posts/this-is-a-post
    * `<SinglePost />`
* `/tags/:tag`
    * show all posts by a tag, again using the PostsIndex component from before
    * `<PostsIndex />`
* `/signup`
    * removed from Base since we're hard coding all accounts because this is a private blog


##### App.js & Navigation
* This is the main container – all routes are passed through this all children as props 
* All navigation is handled in the `AppNavigation` component
    * Note: proptypes are extracted to the outside of the component from Base 4, to be more similar to how proptypes are handled in other components

##### Data Containers
One of the differences between Base 4 and the tutorial is the use of `React-Komposer` containers to replace `getMeteorData()`. More information can be found [here](https://themeteorchef.com/snippets/using-react-komposer/). Basically `React-Komposer` does the same thing, but in a slightly different way. There's also a new official `Create Container` method by the Meteor Development Group. [Read more about it here](https://themeteorchef.com/snippets/using-create-container/#comment-2746738065).

Basically, the way containers work is that you `import` a component through a container. The container subscribes to a Meteor data collection, makes sure the data returned is expected, and passes the data along as props into the component.

##### Documents
* The Documents section has been included as a reference to Base 4, and has been completely untouched

##### Posts API
* Created a new `imports/api/posts` folder to handle blog posts
* Posts schema
    * added stricter Posts allow / deny rules to posts.js (Base 4.3 has these added as well for Documents)
* Displaying Posts
    * Route to `Posts` component added to `routes.js`
    * `Posts` page component added displaying posts in a list called `PostsList`
    * `PostsList` imported through komposer container `containers/posts-list.js`
    * 'PostsList' added as component module
    * The tutorial had a line `linked={ true }` when rendering `PostsList` that always seemed to resolve to true, so the line was removed 
    * `containers/posts-list.js` follows the tutorial's suggestion to add additional data to the posts object returned from the `posts` collection
        * I'm not sure if I'm a fan of adding data like `uid`, `href` and `label` like in the `getMeteorData` in the `posts-list.jsx` part of the tutorial. I think this information might be better suited to the display components than the data container component
* Adding Posts
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


##### Helpers

* `get-input-value.js` – added a helper to get checked values







### Naming & Organization

All files are organized according to Base 4, so many of the files and folders are differently laid out than in the tutorial. I think it's for the better, as Base 4 has fewer files and folders, so finding what you need is less of a rabbit hunt.

Naming is very important, as it can easily help developers, especially someone from outside the project, understand how everything fits together. The tutorial makes some hasty decisions on naming files, collections, and react components that can add to confusion. 

For example, the component for displaying all public posts is called `PostsIndex` and the publication is named `postsIndex`, which makes it easy to understand that they're connected, but does not describe what the publication does.

This sections shows my thinking in establishing a better pattern for understandability and searchability.



#### Collections

Collections are capitalized to indicate a collection. These aren't really used very often, except for when debugging using the Meteor Mongo interface, so they're ok being short.

* `Posts` Collection
* `Documents` Collection
* `Files` Collection – note that the file-collection package uses the collection name as part of the URL by default, so the url would be `http://localhost:3000/gridfs/Files/[filename]`. However, it doesn't seem like file-collection is case-sensitive.



#### Publications

Meteor publications should be clear as to what information they yield. Publications should not be named for which components they'll exist in, but instead what kind of data they offer.

###### Posts Publications
* `posts` -> `allPosts`
* `postsIndex` -> `publishedPosts`
* `tagsIndex` -> `publishedPostsByTag`
* `singlePost` -> `singlePostBySlug`
* `singlePost` -> `singlePostBySlug`





## Add-on: Handling Images

Since many blogs have a file attachment or image requirement, I thought it would be fun to add file handling, and to push the boundaries of what I learned from the original [TheMeteorChef tutorial](https://themeteorchef.com/recipes/building-a-blog-with-react/).

I also added file and image handling to this base tutorial, since images and files popular with blogs. Although one could use something like the Imgur API, I wanted to experiment with a fully native experience through the use of [file-collection](https://atmospherejs.com/vsivsi/file-collection) and gridFS.

Goal: Add user-uploaded header images to each blog post, and a files list

* add file-collection `meteor add vsivsi:file-collection`
* add jquery cookie `meteor add benjaminrh:jquery-cookie`
* add underscore `meteor add underscore` – used for file-collection handling
* create a new collection
  – update `/startup/server/api.js` with a references to `files` collection – '../../api/files/` ...
  – copy /posts/ into a new /files/ and rename references to files
* new routes
* new /api/
* pages







{: #appmap}
## App Map & Outline

### App Outline

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



{: #styling}
## Styling 

– Styling should generally not care about how the app is organized
– BUT you can run into conflicts, so we can encapsulate and compartmentalize by react components
– avoid confusion when styling (easy to find where some class comes from, at the expense of a longer name)


##### Styling
Added some minor styling into the base `application.scss` file
* .post styling for public post list
*  taller textarea for edit page




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
