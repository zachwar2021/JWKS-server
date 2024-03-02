const express = require('express');
const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('crypto');

const app = express();
const port = 8080;
const host = '127.0.0.1'; 

// RSA public and private key pair generation
const generateKeyPair = () => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {  type: 'spki', format: 'jwk' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  
  const kid = "TheBestkid";
  const expiry = Math.floor(Date.now() / 1000) + 3600; // Key expiry set to 1 hour

  return { kid, expiry, publicKey, privateKey };
};

// Initial key pair
let{ 
  kid,
  expiry, 
  publicKey, 
  privateKey 
} = generateKeyPair();

//check key expiry
const checkKeyExpiry = (req, res, next) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  // Generate a new key pair if the current key is expired
  if (currentTimestamp > expiry) {
    ({kid, expiry,publicKey,privateKey} = generateKeyPair())
  }
  next();
};

// RESTful JWKS(/.well-known/jwks.json) endpoint that issues jwks
app.get('/.well-known/jwks.json',checkKeyExpiry,(req, res) => {
  const jwks = {
    keys: [
      {
        kid: kid,
        kty: 'RSA',
        use: 'sig',
        alg: 'RS256',
        n: publicKey.n,
        e: publicKey.e,
        exp: expiry,
      },
    ],
  };
  res.json(jwks);
});

// /auth endpoint's for post, get, put, delete, patch, head
// the /auth post endpoint issues a token
app.post('/auth', checkKeyExpiry, (req,res) => {
  const expired = req.query.expired=='true';
  let expiresIn= expired? -1 : 36000;

  const payload = { sub: 'zew0013' }; ;
  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn,
    header: { kid },
  });
  res.json({ token });
});

app.get('/auth', checkKeyExpiry,(req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }
  else{

  }
});

app.put('/auth', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }
  else{
    res.send('Updated resource with data: ${JSON.stringify(data)}');
  }
});

app.delete('/auth', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }
  else{
    res.send('Dleted resource');
  }
  
});

app.patch('/auth', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }
  else{
    res.send('Patched resource with data: ${JSON.stringify(data)}');
  }
});

app.head('/auth', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == undefined){
    res.status(405).end('Method Not Allowed');
  }
  else{
    res.status(200).end();
  }
});


//JWKS endpoints for head, post, put, delete, patch
app.head('/.well-known/jwks.json', (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }
  else{
    res.status(200).end();
  }
});

app.post('/.well-known/jwks.json', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }else{

  }
});

app.put('/.well-known/jwks.json', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }else{
  
  }
});

app.delete('/.well-known/jwks.json', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }else{

  }
});

app.patch('/.well-known/jwks.json', checkKeyExpiry, (req, res) => {
  const data = req.body;
  if(data == null){
    res.status(405).end('Method Not Allowed');
  }else{

  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

//this is the tester.js file
module.exports = {app,server};
