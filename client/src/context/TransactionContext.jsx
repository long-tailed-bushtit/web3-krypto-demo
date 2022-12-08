import React, {useEffect, useState} from "react";
import { ethers } from 'ethers';
import {contractABI, contractAddress} from '../utils/constants';
// import { SiAsus } from "react-icons/si";

export const TransactionContext = React.createContext();

const { ethereum } = window;


const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ( {children} ) => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, settransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [ethBalance, setethBalance] = useState("")

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert ("Please install Metamask");

            const accounts = await ethereum.request ({ method: 'eth_accounts'});

            if(accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log(`Current account is ${accounts[0]}`);

                // getAllTransactions();
            } else {
                console.log("No Accounts Found");
            }
        } catch (error) {
        console.log(accounts);
        throw new Error ("No Ethereum object.")

        }
        
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert ("Please install Metamask");

            const accounts = await ethereum.request ({ method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error);
            throw new Error ("No Ethereum object.")
            
        }
    }

    const disconnectWallet = async () => {

        const accounts = await ethereum.request ({ method: 'eth_accounts'});
        try {
            if(accounts.length) {
                setCurrentAccount("")
                ethereum.on
                console.log("Disconnected");
            }
        } catch (error) {
            console.log(error); 
        }

    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert ("Please install Metamask");

            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //hex 21000 GWEI
                    value: parsedAmount._hex, //0.00001 ETH convert decimal to hex
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`)

            getETHBalance();
            const transactionCount = await transactionContract.getTransactionCount();
            settransactionCount(transactionCount.toNumber());
            
        } catch (error) {
            console.log(error);
            throw new Error ("No Ethereum object.")
        }
    }

    const getETHBalance = async () => {
        const accounts = await ethereum.request ({ method: 'eth_accounts'});        
        const value = await ethereum.request({method: 'eth_getBalance', params: [accounts[0], "latest"]})
        const amount = parseFloat((parseInt(value, 16) / Math.pow(10, 18)).toFixed(4))
        
        setethBalance(amount);
        
    }

    useEffect(()=> {
        checkIfWalletIsConnected();
        getETHBalance();
    }, [])

    
    return (
        <TransactionContext.Provider value = {{connectWallet, disconnectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, ethBalance, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )

}