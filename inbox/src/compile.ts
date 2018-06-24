import * as path from 'path';
import * as fs from 'fs';
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

export const compile = solc.compile(source, 1).contracts[':Inbox'];