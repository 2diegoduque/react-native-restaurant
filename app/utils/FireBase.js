import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBL7zjgSKhFHJPOrEVq_H3KTNJdK0kraxM",
  authDomain: "restaurantes-react-native.firebaseapp.com",
  databaseURL: "https://restaurantes-react-native.firebaseio.com",
  projectId: "restaurantes-react-native",
  storageBucket: "restaurantes-react-native.appspot.com",
  messagingSenderId: "284671954923",
  appId: "1:284671954923:web:94a69442f37754d4"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
