import Web3 from "web3";

const HDWalletProvider = require('truffle-hdwallet-provider');
import {compile} from './compile';

const provider = new HDWalletProvider(
    'flame wink violin knife wise actual champion frozen honey robot jelly purpose',
    'https://rinkeby.infura.io/niPA9FtlDXSnDqIXr2ef'
);


const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compile.interface))
        .deploy({data: '0x' + compile.bytecode, arguments: []})
        .send({gas: 1000000, from: accounts[0]});

    console.log(compile.interface);
    console.log('Contract deployed to', result.options.address);
};

deploy();