require('dotenv').config({ path: '.env' });
const express = require('express'), //updated
      path = require('path'), //new exprees built in method
      mongoose = require('mongoose'),
      ejsMate = require('ejs-mate'), //new
      session = require('express-session'),
      flash = require('connect-flash'), //updated
      ExpressError = require('./utils/ExpressError'), //new function
      passport = require('passport'), //updated
      LocalStrategy = require('passport-local'), //updated
      methodOverride = require('method-override');

//Models
const Skatespot = require('./models/skatespot'),
      Comment = require('./models/comment'),
      User = require('./models/user');


//Routes
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

// app.use(express.json({ extended: true })) - not need because forms are using app.use(express.urlencoded({ extended: true })) to parse data.
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public')); //for loading items in public folder

//Flash
const sessionConfig = {
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());


//Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // gives me access to current user within the template on all pages!
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
  if(!err.message) err.message = 'Uh Oh, something went wrong!'
  res.status(statusCode).render('error', { err });
})

app.listen(process.env.PORT || 4000, () => {
   console.log('Server Started!');
 });
