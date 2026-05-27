const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://127.0.0.1:27017/stock-analyzer')
  .then(async () => {
    const users = await User.find({});
    require('fs').writeFileSync('users.json', JSON.stringify(users, null, 2));
    process.exit(0);
  });