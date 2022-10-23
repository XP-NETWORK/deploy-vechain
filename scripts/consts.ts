import { UserNftMinter__factory } from "../typechain-types/factories/UserNftMinter__factory";
import { XPNft1155__factory } from "../typechain-types/factories/XPNft1155__factory";
import { XPNft__factory } from "../typechain-types/factories/XPNft__factory";
import { XPNftRoyalties__factory } from '../typechain-types/factories/XPNftRoyalties__factory';
import { XPNft1155Royalties__factory } from '../typechain-types/factories/XPNft1155Royalties__factory';
import { config } from 'dotenv'; config();

export const CONTRACTS = {
    UserNftMinter: UserNftMinter__factory,
    XPNft1155: XPNft1155__factory,
    XPNft: XPNft__factory,
    XPNFTRoyalties: XPNftRoyalties__factory,
    XPNft1155Royalties: XPNft1155Royalties__factory
};
export type NETWORK = "testnet" | "mainnet";

export type CONTRACT_NAME = keyof typeof CONTRACTS;

export const CONFIG = {
    account: {
        // Private key of the deployer
        privateKey: process.env.SK!
    },
    bridge: {
        //Check for updates here: https://docs.xp.network/docs/Multibridge2.0/bridge_contracts
        testnetContract: "0x4096e08C5d6270c8cd873daDbEAB575670aad8Bc",
        mainnetContract: "0xE860cef926E5e76E0E88fdc762417a582F849C27",
        testnetRPC: "https://sync-testnet.veblocks.net",
        mainnetRPC: "https://sync-mainnet.veblocks.net"
    }
}