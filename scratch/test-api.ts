import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io';
const SECRET_KEY = '0123456789ABCDEF0123456789ABCDEF';

const encryptPassword = (password: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

const decryptPassword = (encrypted: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  // Try different IVs
  const ivs = [
    CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16)),
    CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
    CryptoJS.enc.Utf8.parse('0000000000000000'),
  ];

  const ivNames = ['KeyPrefix', 'ZeroedHex', 'ZeroedUtf8'];
  for (let i = 0; i < ivs.length; i++) {
    const iv = ivs[i];
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const plain = decrypted.toString(CryptoJS.enc.Utf8);
      if (plain) {
        console.log(`Working IV for ${encrypted}: ${ivNames[i]}`);
        return plain;
      }
    } catch (e) {}
  }
  return 'FAILED';
};

const testApi = async () => {
  console.log('--- REVERSE ENGINEERING ---');
  console.log('Decrypting example "FND4uozSl1dirKV8acl0cA==":', decryptPassword('FND4uozSl1dirKV8acl0cA=='));
  console.log('Decrypting example "+rz+UN+Z4eHwyLLs5RXkLg==":', decryptPassword('+rz+UN+Z4eHwyLLs5RXkLg=='));
  
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const encryptedPassword = encryptPassword(testPassword);

  console.log('--- TESTING API ---');
  console.log('Email:', testEmail);
  console.log('Encrypted Password:', encryptedPassword);

  try {
    // 1. Test Registration
    console.log('\n1. Testing Registration...');
    const registerResp = await axios.post(`${API_URL}/api/auth/register`, {
      firstName: 'Test',
      lastName: 'User',
      identificationNumber: '123456789',
      email: testEmail,
      password: testPassword,
      encryptedPassword: encryptedPassword,
      role: 'BUYER'
    });
    console.log('Registration Success:', registerResp.data.message);

    // 2. Test Login
    console.log('\n2. Testing Login...');
    const loginResp = await axios.post(`${API_URL}/api/auth/login`, {
      email: testEmail,
      encryptedPassword: encryptedPassword
    });
    console.log('Login Success! Token:', loginResp.data.data.token.substring(0, 20) + '...');
    
    console.log('\n--- ALL TESTS PASSED ---');
  } catch (error: any) {
    console.error('\n--- TEST FAILED ---');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
};

testApi();
