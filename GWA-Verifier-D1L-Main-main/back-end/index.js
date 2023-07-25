const db = require('./config/database');
const app = require('./app')

/* Checks database connection status*/
db.database.raw("select 1").then(() => {
  console.log("Database successfully connected.");
  // Start the app
  app.start();
})
.catch((err) => {
  console.log("Database connection failed.");
  console.error('ERROR:',err.sqlMessage);
});

