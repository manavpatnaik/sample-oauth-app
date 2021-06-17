const express = require('express');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
