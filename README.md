# React Base Alternate
An (alternate) starting point for Meteor and React.

This is a personal exercise and attempt to rewrite the tutorial on TheMeteorChef called [Building a Blog With React](https://themeteorchef.com/recipes/building-a-blog-with-react/) to use React Router and [Base v4.2.0](https://themeteorchef.com/base/), a system for jumpstarting a Meteor React project.

Please use this project in any way you want: as a learning tool for Meteor, React, or as a starting point for your own projects. Keep in mind that I wrote this as a learning experience, so take it with a grain of salt. 

If you're using this as a learning tool, read [the original tutorial first](https://themeteorchef.com/recipes/building-a-blog-with-react/) and recreate the tutorial in React Router yourself. This form of active learning can be daunting, but really helped me understand both Meteor and React. It'll do you good. I promise.

For amazing tutorials, please check out all the other free resources at [TheMeteorChef](https://themeteorchef.com).

> The documentation is still a work in progress


## Building a Blog with React

The major differences from TheMeteorChef tutorial are using React Router instead of Flow Router, Komposer containers, replacing the use of Mixins with Imports, and using Base 4's newer way of organizing files.

Base 4 is significantly simpler and better organized, but the way some files are named can be confusing, so I've tried to improve the naming experience.

Please [email me at hello@janzheng](hello@janzhengs) with suggestions, questions, comments, and bugs.

A project by [Jan Zheng](http://janzheng.com)



### Images

I also added file and image handling to this base tutorial, since images and files popular with blogs. Although one could use something like the Imgur API, I wanted to experiment with a fully native experience through the use of [file-collection](https://atmospherejs.com/vsivsi/file-collection) and gridFS.


### Organization

Even with Base 4's adherence to the new application structure per the [Meteor Guide](https://guide.meteor.com/structure.html) things get confusing very quickly. I've attempted to alleviate the confusion between file names through file naming conventions, yet still adhering to the Meteor Guide.

To make better sense of how a Meteor + React app is organized, I've attempted to map out the way files include each other. Check out the [Organization](#organization) section and the [App Map & Outline](#appmap).

I also started a way to organize SCSS styling to adhere to React component organization with a BEM-like syntax. Check out the [Styling section](#styling).











## Walkthrough

This walkthrough assumes you've understood [the original Blog tutorial on the meteor chef](https://themeteorchef.com/recipes/building-a-blog-with-react/), and that you have a decent familiarity with Meteor projects.

This app is at the core very similar to the original tutorial app on TheMeteorChef. The purpose of the walkthrough is to document the overarching steps I took to create this app from Base, as well as the differences and additions to the original tutorial, but is not meant to be an exhaustive tutorial.

The code is also fairly extensively commented to provide clarity.

Note that I've renamed, reorganized, and refactored many of the files, components, containers, pages, and so on to be more descriptive than their counterparts in the tutorial, and might also be slightly different from Base as well.






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
* This example uses `extends React.Component` instead of `React.createClasss`. [Read more](https://toddmotto.com/react-create-class-versus-component/)


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
One of the differences between Base 4 and the tutorial is the use of `React-Komposer` containers to replace `getMeteorData()`. More information can be found [here](https://themeteorchef.com/snippets/using-react-komposer/). Basically `React-Komposer` does the same thing, but in a way that is more in line with React's principles. There's also a new official `Create Container` method by the Meteor Development Group. [Read more about it here](https://themeteorchef.com/snippets/using-create-container/#comment-2746738065).

Basically, the way containers work is that you `import` a component through a container. The container subscribes to a Meteor data collection, makes sure the data returned is expected, and passes the data along as props into the component.


##### Documents
* The Documents section has been included as a reference to Base 4, and has been completely untouched


##### Posts
The naming convention used in the tutorial was very confusing for me (e.g. `posts` referred to a list of authenticated posts as opposed to a list of all posts), so I've renamed many of the files, containers, pages, and components to be more descriptive. Unfortunately, this will make the tutorial harder to follow as filenames are now different.

* Created a new `imports/api/posts` folder to handle blog posts
    * the `/api/` folder holds the collection and schema, publications, as well as insert, update, and remove methods for handling posts.
* Posts schema
    * added stricter Posts allow / deny rules to `posts/collection.js` (the latest Base 4.3 has these added as well for Documents)
* Displaying Posts
    * Route to `PostEditlistPage` added to `routes.js` for listing posts for authenticated users (originally this was called `Posts`)
    * `Added a component for displaying a list of authenticated posts `PostList__Auth` (originally `PostsList`)
    * `PostList__Auth` imported through komposer container `containers/post-list__auth.js`
    * The tutorial had a line `linked={ true }` when rendering `PostsList` that always seemed to resolve to true, so the line was removed 
    * `containers/post-list__auth.js` follows the tutorial's suggestion to add additional data to the posts object returned from the `Posts` collection
        * I'm not sure if I'm a fan of adding data like `uid`, `href` and `label` like in the `getMeteorData` in the `posts-list.jsx` part of the tutorial. I think this information might be better suited to the display components than the data container component
* Adding Posts
    * All post adding logic in `post-editlist-page.js` for a new post, as opposed to a new `add-posts.js` file as there aren't many lines of code
* Post Editor
    * We get a specific `postID` from the route as a page parameter, then retrieve the appropriate post to edit. We then pass this post information into `post-edit.js`
    * Renamed editor subscription from `editor` to `postById`
    * `post-edit.js`: Note that the accompanying functionality is combined into a large React component 
    * Form validation uses `login.js`'s' way of validating, and getting input values
    * Post Editor uses `{ PostUpdate }` to process and validate the form
    * PostEdit can't be stateless (since we're using `slug` state and `componentDidMount()`, so we use ES6 syntax to extend React.Component
    * We define the display variables like date within render() instead of using a ton of helper functions, to be more readable
    * I used a React Component because PostEdit needs to use state variables
    * Added a `post-update.js` module to handle post edit updating
    * Added an `isChecked` function to `get-input-value.js` for checkboxes
    * Added stricter validation schema for upsert in `posts/methods.js`
    * In order to be consistent with the tutorial, I've created `posts.js` which renders a list of posts in `posts-list.js`, but this seems to unnecessarily add more files / makes it convoluted
* Post Index
  * When generating tags, I'm checking for "if (tags[0])" since the code will generate empty arrays if tags don't exist
* Post
  * Added an if statement to prevent post body from displaying in post list


##### Helpers

* `get-input-value.js` – added a helper to get checked values







{: #organization}

### Naming & Organization

All files are organized according to Base 4, so many of the files and folders are differently laid out than in the tutorial. I think it's for the better, as Base 4 has fewer files and folders, so finding what you need is less of a rabbit hunt.

Naming is very important, as it can easily help developers, especially someone from outside the project, understand how everything fits together. The tutorial makes some hasty decisions on naming files, collections, and react components that can add to confusion. It's important to remember that the ultimate goal is to keep things simple, understandable and easily maintainable, sometimes even at the cost of consistency.

For example, the component for displaying all public posts is called `PostsIndex` and the publication is named `postsIndex`, which makes it easy to understand that they're connected, but does not describe what the publication does.

This sections shows my thinking in establishing a better pattern for understandability and searchability.



#### Components

The tutorial used some very confusing names for components, containers, and pages regarding Posts. It's not clear at all that for example that `posts-list` is for authenticated users only. Names have been changed to indiciate better what the component does, and `__` is used to denote a differentiating attribute (for example authenticated vs. public post list). Attributes are attached to the end of a name (e.g. PostList__Auth) to keep the component name listed together in the file browser. 

We should also take care to ensure that the Component name matches that of a file name, as this will make importing components more intuitive.

##### Authenticated Post List
* `posts-list.js` File -> `post-list__auth.js`
* `PostsList` Component -> `PostList__Auth`

##### Public Post List
* `public-post.js` File -> `list-list__public.js`
* `PublicPosts` Component -> `PostList__Public`




#### /API/

The API folder combines files for both the client and server. Although `methods.js` and `publications.js` are identically named, the Collection and Schema file (e.g. `posts.js`) are different, breaking consistency. I've renamed them `collection.js` to be consistent.

Note that the /api/documents/ folder has been left alone

* `api/files/files.js` -> `collection.js`
* `api/posts/posts.js` -> `collection.js`


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
* `editor` -> `singlePostById`


#### Modules

Modules are generally reusable methods and sometiems helper functions that reduce the amount of code squeezed into a component page. These files should either describe what the methods do, and not the component or file that imports them. 

A component that needs to render something belongs in `/ui/components/`.


#### Containers

Containers wrap reactive Meteor data subscriptions around React components. As such, each container have a corresponding React component. Containers use the same name as their Component counterparts, but have been prefixed with `__` to clearly distinguish that these are containers, and that there is a component with the same name.

#### Pages

To avoid confusion between components and pages (especially in an editor like SublimeText), we attach `Page` to the end of each Page file. This makes the routes list in `routes.js` much easier to understand, as each route clearly points to a page.



## Add-on: Handling Images

Since many blogs have a file attachment or image requirement, I thought it would be fun to add file handling, and to push the boundaries of what I learned from the original [TheMeteorChef tutorial](https://themeteorchef.com/recipes/building-a-blog-with-react/).

I also added file and image handling to this base tutorial, since images and files popular with blogs. Although one could use something like the Imgur API, I wanted to experiment with a fully native experience through the use of [file-collection](https://atmospherejs.com/vsivsi/file-collection) and gridFS.

Goal: Add user-uploaded header images to each blog post, and a files list

* add file-collection `meteor add vsivsi:file-collection`
* add jquery cookie `meteor add benjaminrh:jquery-cookie`
* add underscore `meteor add underscore` – used for file-collection handling
* create a new collection
    * update `/startup/server/api.js` with a references to `files` collection – '../../api/files/` ...
    * copy /posts/ into a new /files/ and rename references to files
* new routes
* new /api/
* pages







{: #appmap}

## App Map & Outline

### App Outline

* `/public`, `/tests`, `/server`, `/clients` are native meteor runtime folders
* `/import` is dynamically imported files during runtime
* `api/server` is important to differentiate between client-side and server-side data functionality


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

The SCSS should generally not care about how the app is organized, but you can run into conflicts, so we can encapsulate and compartmentalize by components and functionality. 


##### Styling
Added some minor styling into the base `application.scss` file
* .post styling for public post list
*  taller textarea for edit page




## Todo

* add a server / data / publication / methods "documentation"
* draw the current "import" file tree in ReadMe
* handle file upload disconnects (handle resume, or handle garbage collection on componentWillMount() )
* add copious amounts of inline comments explaining every line (for others and your future self)
* organized SCSS naming scheme that matches new file component structure
* a way to document component file relationships 
* finish up the writeup into markdown
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
* rename files to make more sense
    * add file and posts structure to the map
    * improve naming convention (e.g. posts-list is for authenticated posts, but file name doesn't reflect this)
    * see if it makes any sense to move some stuff around or rename files to make more sense (api/posts/... for example don't have a base include file to organize everything) – make more human readable
* make more readable, and upload to github



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
