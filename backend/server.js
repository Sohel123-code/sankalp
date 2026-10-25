const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sankalp API running at http://localhost:${port}`);
});
