require('dotenv').config({silent: true})

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const oktaAuth = require('okta-auth');

const session = require('express-session');
var express = require('express');
var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  cookie: { maxAge: 1*process.env.SESSION_MAX_AGE},
  rolling: true,
  name: 'okta-auth-test',
  saveUninitialized: false,
};

app.use(session(sessionOptions));

oktaAuth.initialize(app, {
  oktaIssuer: process.env.OKTA_ISSUER,
  oktaEntryPoint: process.env.OKTA_ENTRY_POINT,
  oktaCert: process.env.OKTA_CERT,
});

app.get('/', oktaAuth.secured, (req, res) => {
  res.send(req.session.passport.user);
  res.end();
});

const server = app.listen(3000, () => {
  console.log("App listening at http://localhost:%s", server.address().port)
})
