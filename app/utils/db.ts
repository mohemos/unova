import { MongoClient } from 'mongodb';

declare const process: {
  env: {
    MONGO_DB_CONNECTION_STRING: string;
  };
};

const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectWithNoPrimary: true,
});

export default client;
