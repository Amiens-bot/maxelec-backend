const app = require('./app');
const { APP_PORT: PORT } = require('./utils/config');

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
