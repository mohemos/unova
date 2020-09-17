import { errorMessage } from 'iyasunday';
import Match from '../modules/match';
import Team from '../modules/team';
import Player from '../modules/player';

export default (app) => {
  const apiVersion = `/api/${process.env.API_VERSION}/`;
  app.use(apiVersion, Team);
  app.use(apiVersion, Player);
  app.use(apiVersion, Match);

  app.use((err, req, res, next) => {
    if (err) {
      res.status(500).json(errorMessage(err));
    }
    next();
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Requested route not found' });
  });
};
