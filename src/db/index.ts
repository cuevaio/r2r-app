import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

if (!process.env.DB_URL) {
  throw new Error('Missing DB_URL');
}

// Singleton function to ensure only one db instance is created
function singleton<Value>(name: string, value: () => Value): Value {
  const globalAny: any = global;
  globalAny.__singletons = globalAny.__singletons || {};

  if (!globalAny.__singletons[name]) {
    globalAny.__singletons[name] = value();
  }

  return globalAny.__singletons[name];
}

export const createDBConnection = () => {
  const client = postgres(process.env.DB_URL!);

  const db = drizzle(client);

  return db;
};
const db = singleton('db', createDBConnection);

export { db, schema };
