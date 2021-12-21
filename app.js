require('dotenv').config({ path: '.env' });
const express = require('express'), //updated
      mongoose = require('mongoose'),
      ejsMate = require('ejs-mate'), //new
      path = require('path'), //new exprees built in method
      flash = require('connect-flash'),
      ExpressError = require('./utils/ExpressError'),
      passport = require('passport'), //updated
      LocalStrategy = require('passport-local'), //updated
      methodOverride = require('method-override'),
      Skatespot = require('./models/skatespot'),
      Comment = require('./models/comment'),
      User = require('./models/user');


//require routes
const commentRoutes = require('./routes/comments'),
      skatespotRoutes = require('./routes/skatespots'),
      authRoutes = require('./routes/auth');

//db config
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
   console.log('Database is connected!');
});

const app = express();

// app.use(express.json({ extended: true }));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //for loading items in public folder
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
//Passport Config
app.use(
  require('express-session')({
    secret: 'Max is feeling better!',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', authRoutes);
app.use('/skatespots', skatespotRoutes);
app.use('/skatespots/:id/comments', commentRoutes);

app.get('/', (req, res) => {
  res.render('landing');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Wrong' } = err;
  res.status(statusCode).send(message);
  
    // const { statusCode = 500 } = err;
    // if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    // res.status(statusCode).render('error', { err })
})

app.listen(process.env.PORT || 4000, () => {
   console.log('Server Started!');
 });
