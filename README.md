# 3DES and MD5 in NodeJs
Usage:

  ```
  npm install
  node app.js --help
  node app.js -f 'e' --text "TEST" --key '#@uD!tx#~'
  ```
PS: **Dont** use triple DES nowadays. It only provides at best 112 bit of security even if you use the largest key size of 192 bit. If a shorter key size is used, then it only provides 56 of security. Use AES instead.
