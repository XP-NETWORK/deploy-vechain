import { config } from 'dotenv'; config();
import * as thor from "web3-providers-connex";
import { ethers } from 'hardhat';
import { Driver, SimpleNet, SimpleWallet } from "@vechain/connex-driver";
import { Framework } from "@vechain/connex-framework";
import { Contract, ContractFactory } from "ethers";
import {
	CONFIG,
	CONTRACTS,
	NETWORK,
	CONTRACT_NAME,
} from './consts'


/**
 * Initial settings boilerplate
 * @param network "testnet" | "mainnet"
 * @returns void
 */
export const setup = (network: NETWORK) => {

	let RPC: string;
	let BridgeContract: string;

	switch (network) {
		case 'testnet':
			RPC = CONFIG.bridge.testnetRPC!;
			BridgeContract = CONFIG.bridge.testnetContract!
			break;
		case 'mainnet':
			RPC = CONFIG.bridge.mainnetRPC!;
			BridgeContract = CONFIG.bridge.mainnetContract!
			break;
		default:
			throw Error(`The 'network' should be 'testnet' or 'mainnet' while ${network} has been provided`)
	}

	return { RPC, BridgeContract }

}

/**
 * Argument collection boilerplate
 * @param network "testnet" | "mainnet"
 * @param contractType one of the CONTRACTS Object Keys
 * @param collectionName the name of the NFT colleciton
 * @param tokenTicker the collection short identifier
 * @param royaltyBeneficiary a royalty receiver address
 * @param royaltyPercent the precentage of royalties 1-100
 * @returns 
 */
export const populateArgs = (
	network: NETWORK,
	contractType: CONTRACT_NAME,
	collectionName: string,
	tokenTicker: string,
	royaltyBeneficiary: string,
	royaltyPercent: number
) => {

	const testnetBase = "https://bridge-wnftapi.herokuapp.com";
	const mainnetBase = "https://nft.xp.network";

	let nftPrefix: string;
	let nftPrefix1155: string;

	if (network == 'testnet') {
		nftPrefix = `${testnetBase}/w/`;
		nftPrefix1155 = `${testnetBase}/w/{id}`;
	} else {
		nftPrefix = `${mainnetBase}/w/`;
		nftPrefix1155 = `${mainnetBase}/w/{id}`;
	}

	let args = [];

	if (contractType == 'XPNft1155') {
		args.push(nftPrefix1155);
		return args;
	}

	if (contractType == "XPNft1155Royalties" && royaltyPercent && royaltyBeneficiary) {
		args.push(nftPrefix1155)
		args.push([
			royaltyBeneficiary,
			royaltyPercent * 100
		])
		return args;
	} else {
		args.push(collectionName);
		args.push(tokenTicker);
		args.push(nftPrefix)
	}

	console.log("Args:", args);

	return args;
}

/**
 * Ownership Transferring Boilerplate
 * @param contract an ether's contract object
 */
const transferOwnership = async (network: NETWORK, contract: Contract) => {

	console.log("Transferring Ownership...");

	const { BridgeContract } = setup(network)

	const passOwnership = await contract.transferOwnership(BridgeContract);
	await passOwnership.wait();
}

/**
 * The main Deployment funciton
 * @param contract_name one of the CONTRACTS Object Keys
 * @param network "testnet" | "mainnet"
 * @param args an array of arbitrary arguments
 */
export async function deploy<T extends unknown[]>(
	contract_name: CONTRACT_NAME,
	network: NETWORK,
	...args: T

) {

	const cf = CONTRACTS[contract_name];
	const { RPC } = setup(network);

	const net = new SimpleNet(RPC);
	const wallet = new SimpleWallet();
	wallet.import(`0x${CONFIG.account.privateKey}`);
	const driver = await Driver.connect(net, wallet);

	const provider = thor.ethers.modifyProvider(
		//@ts-ignore
		new ethers.providers.Web3Provider(
			new thor.ConnexProvider({ connex: new Framework(driver) })
		)
	);

	//@ts-ignore
	const Contract = thor.ethers.modifyFactory(
		//@ts-ignore
		new ContractFactory(
			cf.abi,
			cf.bytecode,
			provider.getSigner(wallet.list[0].address)
		)
	);
	console.log(`Deploying ${contract_name}...`);
	const contract = await Contract.deploy(...args);
	await contract.deployed();

	const testnetExplorer = "https://explore-testnet.vechain.org"
	const mainnetExplorer = "https://vechainstats.com"

	let explorer: string;
	let account: string;
	let transaction: string;
	let tx_tail: string;

	if (network == 'testnet') {
		explorer = testnetExplorer
		account = "accounts"
		transaction = "transactions"
		tx_tail = "#info"
	} else {
		explorer = mainnetExplorer
		account = "account"
		transaction = "transaction"
		tx_tail = "/"
	}

	console.log(
		`${contract_name} deployed to:`,
		`${explorer}/${account}/${contract.address}`,
		`${explorer}/${transaction}/${contract.deployTransaction.hash}${tx_tail}`
	);

	await transferOwnership(network, contract);
}