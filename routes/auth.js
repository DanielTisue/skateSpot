const express =   require('express'),
      router  =   express.Router(),
      passport =  require('passport'),
      catchAsync = require('../utils/catchAsync'),
      auth = require('../controllers/auth');
      
      // async = require('async'),
      // nodemailer = require('nodemailer'),
      // crypto = require('crypto');




//RESGISTER: show register form - REGISTER: Handle sign up logic:
router.route('/register')
      .get(auth.registerForm)
      .post(catchAsync(auth.createUser));

//LOGIN: show login form - LOGIN: Handling login logic:
router.route('/login')
      .get(auth.loginForm)
      .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), auth.logIn);


//Password reset page
// router.get('/forgot', (req, res) => {
//   res.render('auth/forgot');
// });

//Password reset post route
// router.post('/forgot', (req, res, next) => {
//   async.waterfall(
//     [
//       function(done) {
//         crypto.randomBytes(20, function(err, buf) {
//           let token = buf.toString('hex');
//           done(err, token);
//         });
//       },
//       function(token, done) {
//         User.findOne({ email: req.body.email }, function(err, user) {
//           if (err) {
//             req.flash('error', err.message);
//             return res.redirect('back');
//           }
//           if (!user) {
//             req.flash('error', 'No account with that email address exists.');
//             return res.redirect('/forgot');
//           }

//           user.resetPasswordToken = token;
//           user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//           user.save(function(err) {
//             done(err, token, user);
//           });
//         });
//       },
//       function(token, user, done) {
//         const smtpTransport = nodemailer.createTransport({
//           service: 'Gmail',
//           auth: {
//             user: 'skatespotsunlimited@gmail.com',
//             pass: process.env.GMAILPW
//           }
//         });
//         const mailOptions = {
//           to: user.email,
//           from: 'Skate Spots',
//           subject: 'Skate Spots Password Reset',
//           text:
//             'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//             'http://' +
//             req.headers.host +
//             '/reset/' +
//             token +
//             '\n\n' +
//             'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//         };
//         smtpTransport.sendMail(mailOptions, function(err) {
//           console.log('mail sent');
//           req.flash(
//             'success',
//             'An e-mail has been sent to ' +
//               user.email +
//               ' with further instructions.'
//           );
//           done(err, 'done');
//         });
//       }
//     ],
//     function(err) {
//       if (err) return next(err);
//       res.redirect('/forgot');
//     }
//   );
// });

// router.get('/reset/:token', (req, res) => {
//   User.findOne(
//     {
//       resetPasswordToken: req.params.token,
//       resetPasswordExpires: { $gt: Date.now() }
//     },
//     function(err, user) {
//       if (err) {
//         req.flash(
//           'error',
//           'Password reset token is invalid or has expired.'
//         );
//         res.redirect('/forgot');
//       }
//       if (!user) {
//         req.flash('error', 'Password reset token is invalid or has expired.');
//         return res.redirect('/forgot');
//       }
//       res.render('auth/reset', { token: req.params.token });
//     }
//   );
// });

// router.post('/reset/:token', (req, res) => {
//   async.waterfall(
//     [
//       function(done) {
//         User.findOne(
//           {
//             resetPasswordToken: req.params.token,
//             resetPasswordExpires: { $gt: Date.now() }
//           },
//           function(err, user) {
//             if (err) {
//               req.flash(
//                 'error',
//                 'Password reset token is invalid or has expired. Try again!'
//               );
//               return res.redirect('back');
//             }
//             if (!user) {
//               req.flash(
//                 'error',
//                 'Password reset token is invalid or has expired.'
//               );
//               return res.redirect('back');
//             }
//             if (req.body.password === req.body.confirm) {
//               user.setPassword(req.body.password, function(err) {
//                 if (err) {
//                   req.flash('error', err.message);
//                   return res.redirect('back');
//                 }
//                 user.resetPasswordToken = undefined;
//                 user.resetPasswordExpires = undefined;

//                 user.save(function(err) {
//                   if (err) {
//                     req.flash('error', err.message);
//                     return res.redirect('back');
//                   }
//                   req.logIn(user, function(err) {
//                     if (err) {
//                       req.flash('error', err.message);
//                       return res.redirect('back');
//                     }
//                     done(err, user);
//                   });
//                 });
//               });
//             } else {
//               req.flash('error', 'Passwords do not match.');
//               return res.redirect('back');
//             }
//           }
//         );
//       },
//       function(user, done) {
//         let smtpTransport = nodemailer.createTransport({
//           service: 'Gmail',
//           auth: {
//             user: 'skatespotsunlimited@gmail.com',
//             pass: process.env.GMAILPW
//           }
//         });
//         let mailOptions = {
//           to: user.email,
//           from: 'skatespotsunlimited@gmail.com',
//           subject: 'Your password has been changed',
//           text:
//             'Hello,\n\n' +
//             'This is a confirmation that the password for your account ' +
//             user.email +
//             ' has just been changed.\n'
//         };
//         smtpTransport.sendMail(mailOptions, function(err) {
//           req.flash('success', 'Success! Your password has been changed.');
//           done(err);
//         });
//       }
//     ],
//     function(err) {
//       if (err) {
//         req.flash('error', 'Your password could not be changed. Try again.');
//         return res.redirect('back');
//       }
//       res.redirect('/skatespots');
//     }
//   );
// });

// LOGOUT logic + route
router.get('/logout', auth.logOut);


module.exports = router;