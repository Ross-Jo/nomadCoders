import express from 'express';
import passport from 'passport';
import routes from '../routes';
import { home, search } from '../controllers/videoController';
import {
  getJoin, postJoin, getLogin, postLogin, logout,
  githubLogin, postGithubLogIn,
  facebookLogin, postFacebookLogin,
  getMe,
} from '../controllers/userController';
import { onlyPublic, onlyPrivate } from '../middlewares';

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.git_hub, githubLogin);
globalRouter.get(
  routes.github_callback,
  passport.authenticate('github', { failureRedirect: '/login' }),
  postGithubLogIn,
);

globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(
  routes.facebook_callback,
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  postFacebookLogin,
);

globalRouter.get(routes.me, getMe);

export default globalRouter;