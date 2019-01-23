var TDES = require('nod3des');
var CryptoJS = require('crypto-js');
var forge    = require('node-forge');
var utf8     = require('utf8');
var yargs = require('yargs');

var argv = yargs
						.options({
							text: {
								describe: "The text to encrypt/decrypt",
								demandOption: true,
								alias: 't',
								string: true,
							},
							key: {
								describe: "Key to use",
								demandOption: true,
								alias: 'k',
								string: true,
							},
							fn: {
								describe: "(e)ncrypt or (d)ecrypt",
								choices: ["e", "d", "encrypt", "decrypt"],
								demandOptions: true,
								alias: 'f'
							}
						})
						.usage(`MD5 and 3DES-ECB encryption and decryption.\nUsage: $0 -f 'e' -t 'TEST' -k '#@uD!tx#~'`)
						.help()
						.argv

function run(fn, text, key='#@uD!tx#~'){
	var result;
	if(fn === 'e' || fn === 'encrypt'){
		result = TDES.encrypt(key, text)
	} else if (fn === 'd' || fn === 'decrypt') {
		result = TDES.decrypt(key, text)
	}
	console.log(result);
}

// Convert Hex to ASCII string.
function hexToString(hex_String) {
	var hex = hex_String.toString();
	var str = '';

	for (var n = 0; n < hex.length; n += 2) 
	{
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16)); 
	}
	return str;

}

TDES.encrypt = function (key, text){
    key = CryptoJS.MD5(utf8.encode(key)).toString(CryptoJS.enc.Latin1);
    key = key + key.substring(0, 8); 
    // https://github.com/digitalbazaar/forge#cipher
    // Note: CBC and ECB modes use PKCS#7 padding as default
    var cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
    cipher.start({iv:''});
    cipher.update(forge.util.createBuffer(text, 'utf-8'));
    cipher.finish();
    var encrypted = cipher.output;
    // console.log( hexToString(encrypted.toHex()) );
    return ( forge.util.encode64(encrypted.getBytes()) );

}

TDES.decrypt = function (key, encrypted_text){

	key = CryptoJS.MD5(utf8.encode(key)).toString(CryptoJS.enc.Latin1);
	key = key + key.substring(0, 8); 
	var decipher = forge.cipher.createDecipher('3DES-ECB', forge.util.createBuffer(key));
	encrypted_text = forge.util.decode64(encrypted_text);
	decipher.start({iv:''});
	decipher.update(forge.util.createBuffer(encrypted_text, 'utf-8'));
	decipher.finish();
	var decrypted = decipher.output; 
	return hexToString( decrypted.toHex() ); 
}

run(argv.fn, argv.text, argv.key);