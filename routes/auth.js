const express =   require('express'),
      router  =   express.Router(),
      passport =  require('passport'),
      catchAsync = require('../utils/catchAsync'),
      auth = require('../controllers/auth');

//RESGISTER: show register form - REGISTER: Handle sign up logic:
router.route('/register')
      .get(auth.registerForm)
      .post(catchAsync(auth.createUser));

//LOGIN: show login form - LOGIN: Handling login logic:
router.route('/login')
      .get(auth.loginForm)
      .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), auth.logIn);

// LOGOUT logic + route
router.get('/logout', auth.logOut);


module.exports = router;