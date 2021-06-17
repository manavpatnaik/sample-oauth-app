const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use('/api', require('./routes/user'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
