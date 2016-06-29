import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

/* main app container – all routes are passed through this all children as props */
import { App } from '../../ui/layouts/app';

/* authenticated routes */
import { PostEditlistPage } from '../../ui/pages/post-editlist-page'; 
import { PostEditPage } from '../../ui/pages/post-edit-page';
import { FileListPage } from '../../ui/pages/file-list-page';

/* public routes */
import { Documents } from '../../ui/pages/documents';
import { PostListPage } from '../../ui/pages/post-list-page'; // the public posts list
import { PostSinglePage } from '../../ui/pages/post-single-page';
import { LoginPage } from '../../ui/pages/login-page';
import { NotFoundPage } from '../../ui/pages/not-found-page';
import { RecoverPasswordPage } from '../../ui/pages/recover-password-page';
import { ResetPasswordPage } from '../../ui/pages/reset-password-page';
import { SignupPage } from '../../ui/pages/signup-page';


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
        <Route name="documents" path="/documents" component={ Documents } onEnter={ requireAuth } />
        <Route name="posts" path="/posts" component={ PostEditlistPage } onEnter={ requireAuth } />
        <Route name="editor" path="/posts/:_id/edit" component={ PostEditPage } onEnter={ requireAuth } />
        <Route name="files" path="/files" component={ FileListPage } onEnter={ requireAuth } />

        {/* public routes */}
        <IndexRoute name="index" component={ PostListPage } onEnter={ authRedirect }/> {/* IndexRoute is the main "/" route */}
        <Route name="login" path="/login" nextPathname="/posts" component={ LoginPage } />
        <Route name="tagIndex" path="/tags/:tag" component={ PostListPage } /> {/* funny enough, if this line is above /login, /tags/login will resolve to the login screen */}
        <Route name="singlePost" path="/posts/:slug" component={ PostSinglePage } />

        <Route name="recover-password" path="/recover-password" component={ RecoverPasswordPage } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPasswordPage } />
        
       {/* <Route name="signup" path="/signup" component={ Signup } />*/} {/* private blog, and no signups allowed */}
        <Route path="*" component={ NotFoundPage } />

      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});

