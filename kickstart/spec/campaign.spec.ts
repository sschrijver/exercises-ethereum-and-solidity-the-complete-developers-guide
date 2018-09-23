import "jasmine";
import {Contract} from "web3/types";
import Web3 from "web3";

const ganache = require('ganache-cli');

console.log(__dirname);

const compiledFactory = require('../dist/contracts/build/CampaignFactory.json');
const compiledCampaign = require('../dist/contracts/build/Campaign.json');

describe('Campaign', () => {
    const web3 = new Web3(ganache.provider());
    let accounts: Array<string>;
    let factory: Contract;
    let campaignAddress: string;
    let campaign: Contract;

    beforeEach(async () => {
        // Get a list of all accounts.
        accounts = await web3.eth.getAccounts();

        // Use one of those accounts to deploy the contract
        factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({
                data: compiledFactory.bytecode,
                arguments: []
            })
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        await factory.methods.createCampaign('100').send({
            from: accounts[0],
            gas: '1000000'
        });

        [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

        campaign = await new web3.eth.Contract(
            JSON.parse(compiledCampaign.interface),
            campaignAddress);
    });

    it('deploys a factory and a campaign', () => {
        expect(factory.options.address).toBeTruthy();
        expect(campaign.options.address).toBeTruthy();
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        expect(manager).toEqual(accounts[0]);
    });

    it('allows peaole to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1],
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        expect(isContributor).toBe(true)
    });

    it('requires a minimum contribution', async () => {
        let error;
        try {
            await campaign.methods.contrbute().send({
                value: '5',
                from: accounts[1]
            });
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest(
            'Buy batteries',
            '100',
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();

        expect(request.description).toEqual('Buy batteries');
    });

    it('processes request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            'A',
            web3.utils.toWei('5', 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let initBalanceAccounts1 = await web3.eth.getBalance(accounts[1]);
        initBalanceAccounts1 = web3.utils.fromWei(initBalanceAccounts1, 'ether');

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let finalBalanceAccounts1 = await web3.eth.getBalance(accounts[1]);
        finalBalanceAccounts1 = web3.utils.fromWei(finalBalanceAccounts1, 'ether');

        expect(+finalBalanceAccounts1).toBeGreaterThan(+initBalanceAccounts1)
    });
});

