import Web3 from "web3";

const HDWalletProvider = require('truffle-hdwallet-provider');

const compiledFactory = require('./contracts/build/CampaignFactory.json');
const compiledCampaign = require('./contracts/build/Campaign.json');

const provider = new HDWalletProvider(
    'flame wink violin knife wise actual champion frozen honey robot jelly purpose',
    'https://rinkeby.infura.io/niPA9FtlDXSnDqIXr2ef'
);


const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await        new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: '0x' + compiledFactory.bytecode, arguments: ['Hi there!']})
        .send({gas: 1000000, from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};

deploy();