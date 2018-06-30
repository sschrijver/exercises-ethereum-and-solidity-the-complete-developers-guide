import "jasmine";
import {compile} from "../src/compile";
import {Contract} from "web3/types";
import Web3 from "web3";

const ganache = require('ganache-cli');

describe('Lottery', () => {
    const web3 = new Web3(ganache.provider());
    let accounts: Array<string>;
    let lottery: Contract;

    beforeEach(async () => {
        // Get a list of all accounts.
        accounts = await web3.eth.getAccounts();

        // Use one of those accounts to deploy the contract
        lottery = await new web3.eth.Contract(JSON.parse(compile.interface))
            .deploy({
                data: compile.bytecode,
                arguments: []
            })
            .send({
                from: accounts[0],
                gas: '1000000'
            });

    });
});

