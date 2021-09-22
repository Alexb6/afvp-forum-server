require('dotenv').config();

const app = require('./app');

const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || "development";

/* Sequelize models check */
// const db = require('./models');
// db.sequelize.sync().then(() => {
// 	console.log('Models are synchronized successfully!');
// }).catch(err => {
// 	console.error('Unable to synchronize the models: ', err);
// });

app.listen(port, () => {
	console.log(`App is running on port ${port}...`);
	console.log(`Current environment is ${env}`);
});
