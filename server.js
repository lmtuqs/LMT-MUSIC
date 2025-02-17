// Use dotenv
require('dotenv').config();

// Require framework
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

// Layout
const expressEJSLayout = require('express-ejs-layouts');
const path = require('path');

// Init
const app = express();
const PORT = process.env.PORT || 3000;

const root = path.join(__dirname, 'www')
const views = path.join(__dirname, 'views')

// #region [ Config ]
app.use(cors())
app.use(cookieParser())
app.use(express.static(root));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// EJS
app.set('view engine', 'ejs');
app.set('views', views);
app.use(expressEJSLayout);
app.set('layout', 'layouts/main_layout');
app.set("layout extractScripts", true)
app.set("layout extractStyles", true);
// #endregion

// Routes
const initRoutes = require('./server/routes');
initRoutes(app);

// Listening
app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);     
});