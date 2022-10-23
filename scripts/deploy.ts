import { deploy, populateArgs } from './functions';
import { CONTRACT_NAME, NETWORK } from './consts';

async function main(
    network: NETWORK,
    contractType: CONTRACT_NAME,
    collectionName: string,
    tokenTicker: string,
    royaltyBeneficiary: string,
    royaltyPercent: number

) {
    // Creating proper argumanets
    const args = populateArgs(
        network,
        contractType,
        collectionName,
        tokenTicker,
        royaltyBeneficiary,
        royaltyPercent
    );

    //Deploying the contract
    await deploy(
        contractType,
        network,
        ...args
    )

    process.exit(0);
}

main(
    /* mainnet|testnet  */ 'testnet',
    /* Contract type    */ 'XPNft1155Royalties',
    /* Collection name  */ 'TestingCollection-1',
    /* Token Identifier */ 'TC1',
    /* Beneficiary addr */ '0x0d7df42014064a163DfDA404253fa9f6883b9187',//
    /* Royalty percent  */ 5
).catch((error) => {
    console.error(error);
    process.exit(1);
});