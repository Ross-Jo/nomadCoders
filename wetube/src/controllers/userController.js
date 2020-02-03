import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res, next) => {
  const {
    body: {
      name, email, password, password2,
    },
  } = req;
  if (password !== password2) {
    req.flash('error', "Passwords don't match");
    res.status(400); // 400 상태코드를 통한 응답을 통해, 크롬 브라우저에서 비밀번호를 저장할 건지 물어보는 다이얼로그를 뜨지 않게 만듦
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};


export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: 'Welcome',
  failureFlash: "Can't log in. Check email and/or password",
});

export const githubLogin = passport.authenticate('github', {
  successFlash: 'Welcome',
  failureFlash: "Can't log in at this time",
});

export const facebookLogin = passport.authenticate('facebook', {
  successFlash: 'Welcome',
  failureFlash: "Can't log in at this time",
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      // eslint-disable-next-line camelcase
      id, avatar_url, name, email,
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const postFacebookLogin = (req, res) => {
  req.flash('info', 'Logged out, see you later');
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) => res.send('Users');

export const getMe = (req, res) => {
  res.render('userDetail', { pageTitle: 'User Detail', user: req.user });
};

export const userDetail = async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (error) {
    req.flash('error', 'User not found');
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => res.render('editProfile', { pageTitle: 'Edit profile' });
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      // avatarUrl: file ? file.path : req.user.avatarUrl,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash('success', 'Profile updated');
    res.redirect(routes.me);
  } catch (error) {
    req.flash('error', "Can't update profile");
    res.redirect(routes.edit_profile);
  }
};

export const getChangePassword = (req, res) => {
  res.render('changePassword', { pageTitle: 'Change Password' });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash('error', "Passwords don't match");
      res.status(400);
      res.redirect(`/users/${routes.change_password}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash('error', "Can't change password");
    res.status(400);
    res.redirect(`/users/${routes.change_password}`);
  }
};
