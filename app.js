const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = 5000;
const subscribers = require('./routes/subscribers.route');
var methodOverride = require('method-override')

app.use(express.static(path.join(__dirname, 'views')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(function(req, res, next) {
    if (req.query._method == "DELETE") {
      req.method = "DELETE";
      req.url = req.path;
    }
    next();
  });


app.use('/', subscribers)


// Error handeling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    })
});


app.listen(port);