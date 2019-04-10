import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import notifyReducer from "./Reducers/notifyReducer";
import settingReducer from "./Reducers/settingReducer";

const firebaseConfig = {
  apiKey: "AIzaSyDlGdahUQ3Fz4uonD8R1POAAnoKAMSqBo4",
  authDomain: "reactfreelancemanager.firebaseapp.com",
  databaseURL: "https://reactfreelancemanager.firebaseio.com",
  projectId: "reactfreelancemanager",
  storageBucket: "reactfreelancemanager.appspot.com",
  messagingSenderId: "86397722254"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};
//init firebase instance
firebase.initializeApp(firebaseConfig);
// Initialize other services on firebase instance
// const firestore = firebase.firestore();
// const settings = { timestampsInSnapshots: true };
// firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingReducer
});

// Check for settings in localStorage

if (localStorage.getItem("settings") == null) {
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // Set to localStorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create store with reducers and initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

//create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
