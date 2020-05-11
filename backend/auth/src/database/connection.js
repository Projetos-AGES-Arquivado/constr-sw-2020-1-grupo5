import admin from 'firebase-admin';
import serviceAccount from './dbconfig.json';

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://constrsw-2020-grupo5.firebaseio.com",
});

export default admin;