const User =      require('../models/user'),
      nodemailer = require('nodemailer'),
      crypto = require('crypto');

module.exports.registerForm = (req, res) => {
   res.render('auth/register'); 
}

module.exports.createUser = async (req, res) => {
  try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', `You're successfully signed up! Welcome to Skate Spots ${user.username}!`);
        res.redirect('/skatespots');
      })
      
  } catch(e) {
      console.log(e);
      req.flash('error', 'Username already exists!')
      return res.redirect('/register');
  }
}

module.exports.loginForm = (req, res) => {
  res.render('auth/login'); 
}

module.exports.logIn = (req, res) => {
      req.flash('success', 'Welcome back to Skate Spots!');
      const redirectUrl = req.session.returnTo || '/skatespots'; //Not sure I want to keep this because error occurs when you delete a comment , logout, then log back in...shows page not found error from error handler.
      delete req.session.returnTo;
      res.redirect(redirectUrl)
}






module.exports.logOut = (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out successfully');
  res.redirect('/skatespots');
}