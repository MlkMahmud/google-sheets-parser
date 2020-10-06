import http from 'http';
import app from './app';

const port = parseInt(process.env.PORT || '', 10) || 3000;
const env = process.env.NODE_ENV || 'development';

http.createServer(app).listen(port, (err?: Error) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`> Running on port:${port} - env:${env}`);
  }
});
