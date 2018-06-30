import * as path from 'path';
import * as fs from 'fs';
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
let source = fs.readFileSync(lotteryPath, 'utf8');

export const compile = solc.compile(source, 1).contracts[':Lottery'];