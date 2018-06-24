import "jasmine";
import {compile} from "../src/compile";
import {Contract} from "web3/types";
import Web3 from "web3";

const ganache = require('ganache-cli');

describe('Inbox', () => {
    const web3 = new Web3(ganache.provider());
    let accounts: Array<string>;
    let inbox: Contract;

    beforeEach(async () => {
        // Get a list of all accounts.
        accounts = await web3.eth.getAccounts();

        // Use one of those accounts to deploy the contract
        inbox = await new web3.eth.Contract(JSON.parse(compile.interface))
            .deploy({
                data: compile.bytecode,
                arguments: ['Hi there!']
            })
            .send({
                from: accounts[0],
                gas: '1000000'
            });

    });

    it('deploys a contract', () => {
        expect(inbox.options.address).toBeTruthy();
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        expect(message).toEqual('Hi there!');

    });

    it('can change the message', async ()=>{
        await inbox.methods.setMessage('bye').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        expect(message).toEqual('bye');
    });
});

