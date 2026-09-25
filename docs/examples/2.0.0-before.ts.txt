import { add, capitalize, formatNumber, groupBy, Logger, type User } from './index';
import { config } from './index';

console.log('sum(typed):', add(2, 3));
console.log('capitalize(typed):', capitalize('hello'));
console.log('format(ok):', formatNumber(123.456));

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

console.log('group ok:', groupBy(users, 'name'));

const logger = new Logger(config.LOG_LEVEL);
logger.info('Application started');
logger.debug('Extra debug info');
