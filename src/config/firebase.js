// CONFIGURACIONES DE FIREBASE
const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage');



// const firebaseConfig = {
//   apiKey: "AIzaSyDkWZGpcgmnYUPRImpIhGJqdUeuWBBcd88",
//   authDomain: "videos-test-1ed16.firebaseapp.com",
//   projectId: "videos-test-1ed16",
//   storageBucket: "videos-test-1ed16.appspot.com",
//   messagingSenderId: "314478715965",
//   appId: "1:314478715965:web:a0406d15614aab1389b654"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyAeYF80oacgvq6pOMsi4klmcbaNUyPmx_E",
//   authDomain: "proyecto-tt-ii.firebaseapp.com",
//   projectId: "proyecto-tt-ii",
//   storageBucket: "proyecto-tt-ii.appspot.com",
//   messagingSenderId: "199857864021",
//   appId: "1:199857864021:web:230819f2a8e2683ac883dc"
// };

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