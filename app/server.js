const path = require('path');
const express = require('express');
const compression = require('compression');

const DIST_DIR = path.join(__dirname, 'build');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(DIST_DIR));
app.use(compression());

app.get('*', function(req, res) {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

/* eslint-disable-next-line */
console.log(`Running production build on port ${PORT}`);

app.listen(PORT);
