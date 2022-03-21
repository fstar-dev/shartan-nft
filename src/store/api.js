import Web3 from 'web3';
import { CONTRACT_ADDRESS, NETWORK_CHAIN_NAME, INFURA_PROJECT_ID } from '../Constants';
import CONTRACT_ABI from '../abi/ABI.json';

const web3 = new Web3(Web3.givenProvider);

const nftContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

const initWeb3AndContract = (library = null) => {
	let web3 = null;
	if (!library) {
		web3 = new Web3(`https://${NETWORK_CHAIN_NAME}.infura.io/v3/${INFURA_PROJECT_ID}`);
	} else {
		web3 = library;
	}
	const nftContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
	return {web3, nftContract};
}

export const WeiToEth = (amount_in_wei) => {
	const { web3 } = initWeb3AndContract();
	return web3.utils.fromWei(amount_in_wei);
}

export const EthToWei = (amount_in_eth) => {
	const { web3 } = initWeb3AndContract();
	return web3.utils.toWei(amount_in_eth, "ether");
}

export const isAddress = (addr) => {
	const { web3 } = initWeb3AndContract();
	return web3.utils.isAddress(addr);
}

export const balanceOf = async(address, library=null) => {
	const { nftContract } = initWeb3AndContract(library);
	try {
		const balance = await nftContract.methods.balanceOf(address).call();
		return balance;
	} catch (e) {
		console.log(e);
		createError(catchSmartContractErrorMessage(e));
	}
}

export const getTotalDividendsDistributed = async(library=null) => {
	const { nftContract } = initWeb3AndContract(library);
	try {
		const result = await nftContract.methods.getTotalDividendsDistributed().call();
		return result;
	} catch (e) {
		console.log(e);
		createError(catchSmartContractErrorMessage(e));
	}
}

export const getUserDividendsDistributed = async(address, library=null) => {
	const { nftContract } = initWeb3AndContract(library);
	try {
		const result = await nftContract.methods.getAccountDividendsInfo(address).call();
		return result;
	} catch (e) {
		console.log(e);
		createError(catchSmartContractErrorMessage(e));
	}
}

export const catchSmartContractErrorMessage = (e) => {
	const err_msg = String(e).toLowerCase();
	if (err_msg.includes("exceed transaction limit")) {
		return "Exceed one-time mint limit.";
	} else if (err_msg.includes("not in sale")) {
		return "Not in sale."
	} else if (err_msg.includes("exceed wallet limit")) {
		return "Exceed the limit per wallet";
	} else if (err_msg.includes("not whitelisted")) {
		return "You wallet is not whitelisted yet. Please contact us on Discord";
	} else {
		return "The transaction is failed. Please verify that you have enough funds to mint and pay the gas fees. If this issue may be issued continuously, please contact us on Discord."
	}
}

const createError = (err_msg) => {
	throw new Error(err_msg);
}