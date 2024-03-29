const { AeSdk, Node, MemoryAccount, Compiler } = require('@aeternity/aepp-sdk');
const fs = require("fs");
//const aci = require("./ACI.json");

const CONTRACT_SOURCE = fs.readFileSync("./contracts/Cluster.aes", encoding="utf-8")

//console.log(CONTRACT_SOURCE)

const ACCOUNT_KEYPAIR = {
  publicKey: 'ak_e9UjhUM8ePgZUPkFgxFJ1tqv6bTwfeqhxcnTBcrYDyW5QhgqU',
  secretKey: 'eba8786a506fd20e8b00f117e6d6598fd0943ff3d0bd926aea5e1c35802ce36a54584dc898d97866e538fb8a6bfa26db4ea60d69c87c68949b4531078aab2ea2',
};
const NODE_URL = 'https://testnet.aeternity.io';
const COMPILER_URL = 'https://compiler.aepps.com';

(async () => {
  const account = new MemoryAccount({ keypair: ACCOUNT_KEYPAIR });
  const node = new Node(NODE_URL);
  const aeSdk = new AeSdk({
    nodes: [{ name: 'testnet', instance
	    : node }],
    compilerUrl: COMPILER_URL,
  });
  await aeSdk.addAccount(account, { select: true });
  const contract = await aeSdk.getContractInstance({ source: CONTRACT_SOURCE });
  const aci = await contract._aci
  fs.writeFileSync('./clusterACI.json', JSON.stringify(aci));
  //const contract = await aeSdk.getContractInstance({ aci, contractAddress: "ct_2o6P4z4cBaiecJBYzRdPsswAgYJy6MybFRiJ6zckjFVPGtbHG" });
//	console.log(contract)
//	console.log(contract.methods)
	const deployInfo = await contract.deploy();
	//const tx = await contract.methods.createDAO("Legacy", 1, 50, ["ak_2LjLwSdCXjBtdiKFVWJLSs24F7tVcPrWrQPiBSoHdyzvxYztw"]);
	//console.log(tx.decodedResult);
	//const tx2 = await contract.methods.getDAOs();
	//console.log(tx2.decodedResult);
	//console.log(typeof tx2.decodedResult[0].contract_address);
	 

	console.log("contract address", deployInfo.address);


})();
