import React, { createContext, useState, useEffect } from "react";
import { auth, createUserProfileDocument, provider } from "../_firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@firebase/auth";
import { onSnapshot } from "@firebase/firestore";
import { getAuth, updateProfile } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  const authUser = getAuth();

  const setDisplayName = (name) => {
    updateProfile(authUser.currentUser, {
      displayName: name,
    }).catch((error) => {
      // An error occurred
      // ...
    });
  };
  // const signinWithEmail = (email, password) => {
  //   return signInWithEmailAndPassword(auth, email, password).then((cred) => {
  //     setCurrentUser(cred.user);
  //     localStorage.setItem("userAuth", JSON.stringify(cred.user));
  //     navigate("/app/Inbox");
  //   });
  // };

  const signinWithEmail = async (email, password) => {
    try {
      const response = await axios.post(
          `http://127.0.0.1:8000/auth/sign-in?email=${email}&password=${password}`,
      );
      const { access_token } = response.data;
      localStorage.setItem("userToken", access_token);

      const aboutMeResponse = await axios.get('http://127.0.0.1:8000/auth/about-me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const user = aboutMeResponse.data;
      const name = `${user.first_name} ${user.last_name}`
      // Встановлюємо ім'я користувача
      setDisplayName(name);
      // Оновлюємо поточного користувача з інформацією про користувача з бекенду
      setCurrentUser({ ...user, displayName: name });

      navigate("/app/Inbox"); // Перенаправлення на /app/Inbox після успішного входу
    } catch (error) {
      console.error('Sign-in failed:', error);
      // Handle error appropriately
    }
  };

  // const signupWithEmail = async ({ email, password, name }) => {
  //   return createUserWithEmailAndPassword(auth, email, password).then((cred) => {
  //     setDisplayName(name);
  //     setCurrentUser({ ...cred.user, displayName: name });
  //     localStorage.setItem("userAuth", JSON.stringify(cred.user));
  //     navigate("/app/Inbox");
  //   });
  // };
  const signupWithEmail = async ({ first_name, last_name, email, password, confirm_password }) => {
    try {
      const response = await axios.post('http://0.0.0.0:8000/auth/sign-up', {
        first_name,
        last_name,
        email,
        password,
        confirm_password
      });
      const { access_token } = response.data;
      localStorage.setItem("userToken", access_token);

      // Отримуємо інформацію про користувача з бекенду за допомогою токена
      const aboutMeResponse = await axios.get('http://127.0.0.1:8000/auth/about-me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const user = aboutMeResponse.data;
      const name = `${user.first_name} ${user.last_name}`
      // Встановлюємо ім'я користувача
      setDisplayName(name);
      // Оновлюємо поточного користувача з інформацією про користувача з бекенду
      setCurrentUser({ ...user, displayName: name });

      navigate("/app/Inbox"); // Перенаправлення на /app/Inbox після успішної реєстрації
    } catch (error) {
      console.error('Sign-up failed:', error);
      // Handle error appropriately
    }
  };

  const signinGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCurrentUser(user);
        localStorage.setItem("userAuth", JSON.stringify(user));
        navigate("/app/Inbox");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ":", errorMessage);
      });
  };

  const signout = () => {
    const userAuth = getAuth();

    signOut(userAuth)
      .then(() => {
        setCurrentUser(null);
        localStorage.removeItem("userAuth");
      })
      .finally(() => navigate("/"));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      setLoading(false);
      if (userAuth) {
        try {
          const userRef = await createUserProfileDocument(userAuth);

          // Check if the client is online before fetching data
          if (navigator.onLine) {
            onSnapshot(userRef, (snapshot) => {
              const user = {
                ...snapshot.data(),
                id: snapshot.id,
              };
              setCurrentUser(user);

              localStorage.setItem("userAuth", JSON.stringify(user));
            });
          } else {
            // Handle offline scenario here
            console.log("Client is offline. Cannot fetch data.");
            // You can set currentUser based on the local storage or previously cached data
            // Example:
            const storedUserAuth = localStorage.getItem("userAuth");
            if (storedUserAuth) {
              setCurrentUser(JSON.parse(storedUserAuth));
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setCurrentUser(userAuth);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   return !currentUser ? navigate("/") : null;
  // }, [currentUser]);
  const authValue = {
    currentUser,
    signupWithEmail,
    signinWithEmail,
    signinGoogle,
    signout,
  };

  return <AuthContext.Provider value={authValue}>{!loading && children}</AuthContext.Provider>;
};
export default AuthProvider;
