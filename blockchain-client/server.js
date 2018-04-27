/// @title script for starting local server
/// @author Deniel Horvatic (Github: FollowJack)
/// @notes
let express = require('express');
let app = express();
var bodyParser = require('body-parser');
//let bodyParser = require('body-parser')

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router
app.use(bodyParser.json());
// create application/json parser
/*
app.use(bodyParser.urlencoded({
    extended: true
  }));
*/

/// SETUP ///
const testnetUrl = "http://localhost:9545";

const Web3 = require('web3');
const web3 = new Web3(testnetUrl);

const IPFS = require('ipfs')
var fs = require('fs');
const ipfs = new IPFS()

const bs58 = require('bs58');

let accounts = [];
let blocoverAccount;
let tnxOptions;
let contract;

loadAccounts = async () => {
    accounts = await web3.eth.getAccounts();
    blocoverAccount = accounts[0];
    tnxOptions = { from: blocoverAccount };
}

loadContracts = () => {
    contract = new web3.eth.Contract(abi, existingContractAddress);
}

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			}
		],
		"name": "donate",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Donation",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "songIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "playCounter",
				"type": "uint256"
			}
		],
		"name": "Play",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "userIndex",
				"type": "int256"
			},
			{
				"indexed": false,
				"name": "artistName",
				"type": "string"
			}
		],
		"name": "RegisterUser",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "songIndex",
				"type": "int256"
			},
			{
				"indexed": false,
				"name": "songHash",
				"type": "bytes"
			}
		],
		"name": "RegisterSong",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "songIndex",
				"type": "int256"
			}
		],
		"name": "SongPlayer",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "songIndex",
				"type": "uint256"
			}
		],
		"name": "play",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "songHash",
				"type": "bytes"
			}
		],
		"name": "registerSong",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "userId",
				"type": "string"
			},
			{
				"name": "artistName",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "donations",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "songIndex",
				"type": "uint256"
			}
		],
		"name": "getPlayCounter",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "songs",
		"outputs": [
			{
				"name": "hash",
				"type": "bytes"
			},
			{
				"name": "playCounter",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userIdToUsers",
		"outputs": [
			{
				"name": "userAddress",
				"type": "address"
			},
			{
				"name": "userId",
				"type": "string"
			},
			{
				"name": "artistName",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "users",
		"outputs": [
			{
				"name": "userAddress",
				"type": "address"
			},
			{
				"name": "userId",
				"type": "string"
			},
			{
				"name": "artistName",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
const existingContractAddress = "0xfa5b6432308d45b54a1ce1373513fab77166436f";


/// PUBLIC FUNCTION ///
// register user
registerUser = async (user) => {
    let tnx = await contract.methods.registerUser(user.id, user.artistName).send(tnxOptions);
    return tnx;
}

// register song
registerSong = async (songHash) => {
    let tnx = await contract.methods.registerSong(songHash).send(tnxOptions);
    return tnx;
}

// play
play = async (songId) => {
    let tnx = await contract.methods.play().send(tnxOptions);
    return tnx;
}

function ipfsHashToBytes32(ipfs_hash) {
    var h = bs58.decode(ipfs_hash).toString('hex').replace(/^1220/, '');
    if (h.length != 64) {
        console.log('invalid ipfs format', ipfs_hash, h);
        return null;
    }
    return '0x' + h;
}

function bytes32ToIPFSHash(hash_hex) {
    //console.log('bytes32ToIPFSHash starts with hash_buffer', hash_hex.replace(/^0x/, ''));
    var buf = new Buffer(hash_hex.replace(/^0x/, '1220'), 'hex')
    return bs58.encode(buf)
}

// store in IPFS and hash into Ethereum for register
storeSong = async (file) => {
    var filename = 'meta-ukulele.mp3.txt'; // testfile
    let path = "blockchain-client/" + filename;

    let fileOptions = {
        path: path,
        content: fs.readFileSync(path)
    };
    // store IPFS
    let result = await ipfs.files.add(fileOptions);

    // TODO
    let songHash = ipfsHashToBytes32(result[0].hash);

    // store Ethereum
    return registerSong(songHash);
}

donate = async (userId, amount) => {
    let payedTnxOptions = tnxOptions;
    payedTnxOptions.value = "5000000";
    let tnx = await contract.methods.donate(userId).send(payedTnxOptions);
    return tnx;
}


// curl -d '{"id":"1", "artistName":"DJ Bobo"}' -H "Content-Type: application/json" -X POST http://localhost:8080/abi/registerUser
router.post('/registerUser', async (req, res) => {
    let result = registerUser(req.body);
    res.json(result);
});

// curl -d '' -H "Content-Type: application/json" -X POST http://localhost:8080/abi/play/1
router.post('/play/:id', async (req, res) => {
    let songId = req.params.id;
    let result = play(songId);
    res.json(result);
});

// curl http://localhost:8080/abi/donate/0/5
router.get('/donate/:id/:amount', async (req, res) => {
    let userId = req.params.id;
    let amount = parseInt(req.params.amount);
    let result = donate(userId, amount);
    res.json(result);
});

// curl -d '' -H "Content-Type: application/json" -X POST http://localhost:8080/abi/storeSong
router.post('/storeSong', async (req, res) => {
    let file = "TODO";
    let result = await storeSong(file);
    res.json(result);
});

/// SETUP ETHEREUM INTERACTION /// 
loadAccounts();
loadContracts();


// REGISTER OUR ROUTES -------------------------------
app.use('/abi', router);

app.listen(8080);

console.log("Server started! Listen on port: 8080");
