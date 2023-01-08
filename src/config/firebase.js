// CONFIGURACIONES DE FIREBASE
const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage');


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCezsUCabNGTdSMXpXUVgmLTAruRkNxGzI",
  authDomain: "proyecto-tt-ii-b3735.firebaseapp.com",
  projectId: "proyecto-tt-ii-b3735",
  storageBucket: "proyecto-tt-ii-b3735.appspot.com",
  messagingSenderId: "351838744808",
  appId: "1:351838744808:web:d63ac686f4f34093f2d95d"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);



module.exports = { storage }