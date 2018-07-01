import web3 from './web3';

const address = '0xCC6D8B1a3438f86635f4adCeFb2D6d84518D024E';
const abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "manager",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "pickWinner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getPlayers",
        "outputs": [{"name": "", "type": "address[]"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "enter",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "uint256"}],
        "name": "players",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];

export default new web3.eth.Contract(abi, address);
