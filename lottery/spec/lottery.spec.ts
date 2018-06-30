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

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        expect(accounts[0]).toEqual(players[0]);
        expect(players.length).toEqual(1);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        expect(accounts[0]).toEqual(players[0]);
        expect(accounts[1]).toEqual(players[1]);
        expect(accounts[2]).toEqual(players[2]);
        expect(players.length).toEqual(3);
    });

    it('requires a minimum amount of ether to enter', async () => {
        let err;
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 1
            });
        } catch (error) {
            err = error;
        }
        expect(err).toBeTruthy();
    });

    it('only manager can call pickWinner', async () => {
        let err;
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
        } catch (error) {
            err = error;
        }
        expect(err).toBeTruthy();
    });

    it('sends money to the winner and resets the player array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        expect(finalBalance).toBeGreaterThan(initialBalance);

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        expect(players.length).toEqual(0);

        const lotteryBalance= await web3.eth.getBalance(lottery.options.address);

        // Added a '+'-sign, because for some reason lotteryBalance
        // is a string containing a number, so we have to convert it.
        expect(+lotteryBalance).toEqual(0);
    })
});

