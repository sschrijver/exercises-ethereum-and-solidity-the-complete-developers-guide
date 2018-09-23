import web3 from './web3'
import CampaignFactory from './contracts/build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x8c849EF5685F64fdD274e6A12AF6944bf26EfFc7'
);

export default instance;