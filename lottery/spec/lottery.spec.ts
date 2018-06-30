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

    it('deploys a contract', () => {
        expect(lottery.options.address).toBeTruthy();
    });

    it('allows one account to enter', async ()=> {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        expect(accounts[0]).toEqual(players[0]);
        expect(players.length).toEqual(1);
    })
});

