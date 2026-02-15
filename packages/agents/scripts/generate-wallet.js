const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const walletPath = path.join(__dirname, '..', 'deployer-wallet.json');
const keypair = Keypair.generate();
const secretKey = Array.from(keypair.secretKey);
const publicKey = keypair.publicKey.toBase58();

fs.writeFileSync(walletPath, JSON.stringify(secretKey));
console.log('Generated wallet:', publicKey);
console.log('Saved to:', walletPath);
