// Sets Module requirements. //
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// Integrates the express-session module with Sequelize for session storage. //
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Sets the port to listen at 3001. //
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Handlebars.js engine with custom helpers. //
const hbs = exphbs.create({ helpers });

// Configures session management. //
const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 50000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Informs Express.js on which template engine to use. //
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// Syncs database and starts the server. //
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at ${PORT}`));
});
