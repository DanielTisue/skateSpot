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
      methodOverride = require('method-override'),
      helmet = require('helmet');

      
//Models
const Skatespot = require('./models/skatespot'),
      Comment = require('./models/comment'),
      User = require('./models/user');

//Sanitize
const mongoSanitize = require('express-mongo-sanitize');

//Routes
const commentRoutes = require('./routes/comments'),
      skatespotRoutes = require('./routes/skatespots'),
      authRoutes = require('./routes/auth');

const MongoDBStore = require("connect-mongo")(session);
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
app.use(express.static(path.join(__dirname, 'public'))); //for loading items in public folder
app.use(mongoSanitize({ replaceWith: '_' }));

const secret = process.env.SESSIONSECRET;

const store = new MongoDBStore({
    url: process.env.DATABASEURL,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

//Flash
const sessionConfig = {
  store,
  name: 'session',
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, //for production use
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com",
    "https://use.fontawesome.com/releases/v5.10.0/css/all.css",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];

const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com"
];
const fontSrcUrls = [
  "https://kit.fontawesome.com/",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-brands-400.woff2",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-brands-400.woff",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-brands-400.ttf",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-regular-400.woff",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-regular-400.woff2",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-regular-400.ttf",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-solid-900.woff",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-solid-900.woff2",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-solid-900.ttf",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-brands-400.svg",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-regular-400.svg",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-solid-400.svg",
  "https://use.fontawesome.com/releases/v5.10.0/webfonts/fa-solid-900.svg"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'unsafe-eval'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/danieltisue/", 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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
