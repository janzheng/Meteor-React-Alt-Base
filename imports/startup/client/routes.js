import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

/* main app container – all routes are passed through this all children as props */
import { App } from '../../ui/layouts/app';

/* authenticated routes */
import { Posts } from '../../ui/pages/posts'; 
import { Editor } from '../../ui/pages/editor';

/* public routes */
import { Documents } from '../../ui/pages/documents';
import { Files } from '../../ui/pages/files';
import { PostsIndex } from '../../ui/pages/posts-index'; // the public posts list
import { SinglePost } from '../../ui/pages/single-post';
import { Login } from '../../ui/pages/login';
import { NotFound } from '../../ui/pages/not-found';
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { Signup } from '../../ui/pages/signup';


const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

/*
    Route to /posts if a user is logged in
*/
const authRedirect = (nextState, replace) => {
  if (Meteor.userId()) {
    replace({
      pathname: '/posts'
    });
  }
};

/*
    Routing
    
    Remember that order matters in routing. The first matched route will trigger first,
    so all authenticated routes should be placed first, and the 404 catchall should be last.
*/
Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>

        {/* authenticated routes*/}
        <Route name="posts" path="/posts" component={ Posts } onEnter={ requireAuth } />
        <Route name="editor" path="/posts/:_id/edit" component={ Editor } onEnter={ requireAuth } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ requireAuth } />
        <Route name="files" path="/files" component={ Files } onEnter={ requireAuth } />

        {/* public routes */}
        <IndexRoute name="index" component={ PostsIndex } onEnter={ authRedirect }/> {/* IndexRoute is the main "/" route */}
        <Route name="login" path="/login" nextPathname="/posts" component={ Login } />
        <Route name="tagIndex" path="/tags/:tag" component={ PostsIndex } /> {/* funny enough, if this line is above /login, /tags/login will resolve to the login screen */}
        <Route name="singlePost" path="/posts/:slug" component={ SinglePost } />

        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        
       {/* <Route name="signup" path="/signup" component={ Signup } />*/} {/* private blog, and no signups allowed */}
        <Route path="*" component={ NotFound } />

      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});

