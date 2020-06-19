import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCJLOvs2ibURTcobisenfXi-5IRmUMUcmc",
    authDomain: "iad-r-project.firebaseapp.com",
    databaseURL: "https://iad-r-project.firebaseio.com",
    projectId: "iad-r-project",
    storageBucket: "iad-r-project.appspot.com",
    messagingSenderId: "561709209629",
    appId: "1:561709209629:web:2f1c22510cd93528718ef4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;