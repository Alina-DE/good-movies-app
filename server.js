const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Redis
const redis = require('redis');
module.exports.redisClient = redis.createClient();

// for heroku deployment
const path = require('path');

const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// importing routes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// importing passport
const passport = require('passport');
const { JwtStrategy } = require('./passport-config');

// assigning port
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
passport.use(JwtStrategy);

// routes
app.use('/api/user', userRoutes);
app.use('/api/movie', movieRoutes);
app.use('/wishlist', wishlistRoutes);

// for heroku deployment
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

console.log('Connecting to database...💻');

mongoose
	.connect(
		process.env.MONGODB_URI,
		// {
		//     useNewUrlParser: true,
		//     useUnifiedTopology: true,
		//     useCreateIndex: true,
		//     useFindAndModify: false
		// }
	)
	.then(() => console.log('Database connected! 😎'))
	.catch(error => console.log(error, 'Database did not connect! ☹️❌'));

app.all('*', (req, res) => {
	res.status(500).send('Invalid path');
});

// Listening to Redis
// redisClient.on('connect', function () {
// 	console.log('Connected to Redis...');
// });

app.listen(PORT, () => {
	console.log(`The server is running on port: ${PORT}...🎧`);
});
