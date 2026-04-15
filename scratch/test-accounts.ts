import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io';
const SECRET_KEY = '0123456789ABCDEF0123456789ABCDEF';

const accounts = [
  { email: 'admin@ecommerce.com', encryptedPassword: '+rz+UN+Z4eHwyLLs5RXkLg==' },
  { email: 'seller@ecommerce.com', encryptedPassword: '6CUlktMuoc0Te4Rp0fL7ZQ==' },
  { email: 'buyer1@ecommerce.com', encryptedPassword: 'WjtozI6MB75seMgpx3Mjfg==' },
  { email: 'buyer2@ecommerce.com', encryptedPassword: 'N2Xwq4WX0/jJmTp+aHlatg==' },
  { email: 'email@example.com', encryptedPassword: '6CUlktMuoc0Te4Rp0fL7ZQ==' }
];

const testAccounts = async () => {
  console.log('--- TESTING PROVIDED ACCOUNTS ---');
  
  for (const account of accounts) {
    console.log(`\nTesting Login for: ${account.email}`);
    try {
      const loginResp = await axios.post(`${API_URL}/api/auth/login`, {
        email: account.email,
        encryptedPassword: account.encryptedPassword
      });
      console.log(`✅ Success! Role: ${loginResp.data.data.role}`);
    } catch (error: any) {
      console.log(`❌ Failed: ${error.response?.data?.message || error.message}`);
    }
  }
};

testAccounts();
