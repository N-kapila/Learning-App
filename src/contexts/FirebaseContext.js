import PropTypes from "prop-types";
import { createContext, useEffect, useReducer, useState } from "react";

import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
//
import { AUTH, DB } from "../config";

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ["demo@minimals.cc"];

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "INITIALISE") {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: "firebase",
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [profile, setProfile] = useState(null);

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userRef = doc(DB, "users", user.uid);

          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }

          dispatch({
            type: "INITIALISE",
            payload: { isAuthenticated: true, user },
          });
        } else {
          dispatch({
            type: "INITIALISE",
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),
    [dispatch]
  );

  const login = (email, password) =>
    signInWithEmailAndPassword(AUTH, email, password);

  const studentRegister = (
    username,
    email,
    password,
    firstName,
    lastName,
    birthDay,
    grade,
    address
  ) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async (res) => {
        const userRef = doc(collection(DB, "users"), username);

        setDoc(userRef, {
          username,
          email,
          displayName: `${firstName} ${lastName}`,
          birthDay,
          grade,
          address,
          role: "STUDENT",
          uid: res.user.uid,
        });
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });

  const teacherRegister = (
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber
  ) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async (res) => {
        const userRef = doc(collection(DB, "users"), username);

        setDoc(userRef, {
          username,
          email,
          phonenumber: phoneNumber,
          displayName: `${firstName} ${lastName}`,
          role: "TEACHER",
          uid: res.user.uid,
        });
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });

  const logout = () => signOut(AUTH);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "firebase",
        user: {
          id: state?.user?.uid,
          email: state?.user?.email,
          photoURL: state?.user?.photoURL || profile?.photoURL,
          displayName: state?.user?.displayName || profile?.displayName,
          role: ADMIN_EMAILS.includes(state?.user?.email) ? "admin" : "user",
          phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || "",
          country: profile?.country || "",
          address: profile?.address || "",
          state: profile?.state || "",
          city: profile?.city || "",
          zipCode: profile?.zipCode || "",
          about: profile?.about || "",
          isPublic: profile?.isPublic || false,
        },
        login,
        studentRegister,
        teacherRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };