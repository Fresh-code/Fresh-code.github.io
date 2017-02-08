'use strict';
const express = require('express');
const app = express();

require('./routes/routes')(app);

app.listen(3000, function () {
    console.log('App listening on port 3000');
});