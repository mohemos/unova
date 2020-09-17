import express from 'express';
import db from './utils/db';
import middlewares from './route/middleware';
import route from './route';

const app = express();

db.connect()
  .then(() => {
    middlewares(app);
    route(app);
    app.listen(process.env.PORT, (err) => {
      if (err) console.log(err);
      else
        console.log(
          `======Connection started on ${process.env.PORT}==========`
        );
    });
  })
  .catch((err) => console.log(err));

process.on('SIGINT', () => {
  db.close();
});
