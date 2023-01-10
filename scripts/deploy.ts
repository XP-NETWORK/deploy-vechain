import { deploy, populateArgs } from './functions';
import { CONTRACT_NAME, NETWORK } from './consts';

async function main(
    network: NETWORK,
    contractType: CONTRACT_NAME,
    collectionName: string,
    tokenTicker: string,
    originalNonce: number,
    originalContract:string,
    royaltyBeneficiary: string,
    royaltyPercent: number

) {
    // Creating proper argumanets
    const args = populateArgs(
        network,
        contractType,
        collectionName,
        tokenTicker,
        originalNonce,
        originalContract,
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
    /* mainnet|testnet   */ 'mainnet',
    /* Contract type     */ 'XPNFTRoyalties',
    /* Collection name   */ 'CryptoSpaceClub',
    /* Token Identifier  */ 'CSC',
    /* Original Nonce    */ 9,
    /* Original Contract */ "TGkgcveyPzhzj18dtxpzaAtcL5ZUB8965A",//Tron
    /* Beneficiary addr  */ '0xf3768EC5C19A4A84Df37499A8c40D85C103Ee580',//
    /* Royalty percent   */ 20
).catch((error) => {
    console.error(error);
    process.exit(1);
});