from django.conf import settings
import os
from web3 import Web3
from dotenv import load_dotenv
from eth_utils import to_checksum_address

load_dotenv()

# Load environment variables or use settings
INFURA_PROJECT_ID = os.getenv('INFURA_PROJECT_ID')
CONTRACT_ADDRESS = to_checksum_address('0x64dae20a8b2e5179a182d69b25ceaeb40fc85264')
WALLET_PRIVATE_KEY = os.getenv('WALLET_PRIVATE_KEY')
WALLET_ADDRESS = to_checksum_address(os.getenv('WALLET_ADDRESS'))

# Initialize Web3
infura_url = f"https://sepolia.infura.io/v3/{INFURA_PROJECT_ID}"
w3 = Web3(Web3.HTTPProvider(infura_url))

# Contract ABI for the deployed contract
CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "date",
                "type": "string"
            },
            {
                "internalType": "string[4]",
                "name": "quarter1Data",
                "type": "string[4]"
            },
            {
                "internalType": "string[4]",
                "name": "quarter2Data",
                "type": "string[4]"
            },
            {
                "internalType": "string[4]",
                "name": "finalsData",
                "type": "string[4]"
            }
        ],
        "name": "addTournament",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getTournament",
        "outputs": [
            {
                "internalType": "string",
                "name": "date",
                "type": "string"
            },
            {
                "internalType": "string[4]",
                "name": "quarter1Data",
                "type": "string[4]"
            },
            {
                "internalType": "string[4]",
                "name": "quarter2Data",
                "type": "string[4]"
            },
            {
                "internalType": "string[4]",
                "name": "finalsData",
                "type": "string[4]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTournamentCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tournaments",
        "outputs": [
            {
                "internalType": "string",
                "name": "date",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "player1",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "player2",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "winner",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "score",
                        "type": "string"
                    }
                ],
                "internalType": "struct TournamentMatch.Match",
                "name": "quarter1",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "player1",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "player2",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "winner",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "score",
                        "type": "string"
                    }
                ],
                "internalType": "struct TournamentMatch.Match",
                "name": "quarter2",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "player1",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "player2",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "winner",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "score",
                        "type": "string"
                    }
                ],
                "internalType": "struct TournamentMatch.Match",
                "name": "finals",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# Initialize contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)