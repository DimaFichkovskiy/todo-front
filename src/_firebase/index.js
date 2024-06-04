import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { collection, doc, getDoc, getFirestore, setDoc, writeBatch } from "@firebase/firestore";
import { generatePushId } from "../utils";
import { icebreakerTasks } from "./icebreakerTasks";

const initConfig = {
  apiKey: "AIzaSyCq1knCvFJ2cTxIgeju12qDH2oeaKZiXuU",
  authDomain: "todo-f157e.firebaseapp.com",
  databaseURL: "https://todo-f157e-default-rtdb.firebaseio.com",
  projectId: "todo-f157e",
  storageBucket: "todo-f157e.appspot.com",
  messagingSenderId: "855606530334",
  appId: "1:855606530334:web:6e28ef1b73bca1cb6a390f",
  measurementId: "G-SD4FLWWND4"
};


const firebaseConfig = initializeApp(initConfig);

export const auth = getAuth(firebaseConfig);

export const provider = new GoogleAuthProvider();
export const db = getFirestore(firebaseConfig);
export { firebaseConfig as firebase };

export const batchWriteIcebreakerTasks = async (userId) => {
  const icebreakerProjectId = "welcome";
  try {
    const icebreakerProject = {
      name: "Welcome 👋",
      projectId: icebreakerProjectId,
      projectColour: {
        name: "Charcoal",
        hex: "#808080",
      },
      projectIsList: true,
    };
    const projectsDocRef = doc(collection(db, "user", `${userId}/projects`));
    setDoc(projectsDocRef, icebreakerProject).then(() => {
      let batch = writeBatch(db);
      while (icebreakerTasks.length) {
        const id = generatePushId();
        batch.set(doc(db, "user", `${userId}/tasks/${id}`), icebreakerTasks.pop());
        if (!icebreakerTasks.length) {
          batch.commit();
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const createUserProfileDocument = async (userAuth) => {
  if (!userAuth) return;

  const userRef = doc(db, "user", userAuth.uid);

  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    setDoc(userRef, { displayName, createdAt, email })
      .finally(() => batchWriteIcebreakerTasks(userAuth.uid))
      .catch((err) => console.log(err));
  }
  return userRef;
};
