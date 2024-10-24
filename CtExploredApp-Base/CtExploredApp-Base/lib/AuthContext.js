//Author: Marek Grabowski

import React, { useContext, useState, useEffect, createContext } from 'react';
import { supabase } from '../lib/supabase'; // Ensure this path is correct
import { maybeCompleteAuthSession, signInWithOAuthProvider, signInWithApple } from './Auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [instaToken, setInstaToken] = useState();
  const [instaUserID, setInstaUserId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      maybeCompleteAuthSession();

      // Fetch exisitng session data
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setUser(session?.user ?? null);
      setLoading(false);
      getIGDatafromDB();


      // Listening for auth state changes
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Returning a cleanup function
      return () => {
        listener?.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const getIGDatafromDB = async () => {
    if (user) {
      // If available, Get Instagram Info from DB
      try {
        // Fetch userinfo data from Supabase
        console.log("Attempting to fetch IG data");

        const { data, error } = await supabase
          .from("user")
          .select("insta_token, instagram_id")
          .single(); // If you expect one record, use single()

        if (error) {
          console.error("Error fetching data from Supabase:", error.message);
          return; // Exit function on error
        }

        if (data) {
          // Assuming you have a state management system like React's useState
          console.log("IG TOKEN:", data.insta_token, "IG ID:", data.instagram_id);

          // Update your state with the fetched data
          setInstaToken(data.insta_token); // Set your state for insta_token
          setInstaUserId(data.instagram_id); // Set your state for instagram_id
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    }
    else{
      console.log("User not logged in");
    }
  };



  updateInstaToken = async (user_id, access_token, ig_uid) => {
    // Update the local state
    console.log(access_token)
    setInstaToken(access_token);
    console.log("igtok " + access_token);
    console.log("instauid " + ig_uid);
    console.log("UID " + user_id);

    try {
      user_id = user.id;
      // rpc needs to be updated to also take instagram uid
      const { data, error } = await supabase.rpc('update_instagram_access_token', { access_token: access_token, insta_id: ig_uid, user_id: user_id })


      if (error) {
        throw error;
      }


    } catch (error) {
      console.error('Error updating instaToken:', error.message);
    }
  };

  // handler for session changes
  const onSessionChange = (session) => {
    setUser(session?.user ?? null);
    setLoading(false);
    getIGDatafromDB();
  };

  //Clear all neecessary states & logout
  const signOut = () => {
    supabase.auth.signOut();
    setInstaToken(null);
    setInstaUserId(null);
  }

  // value, action requested by react hook
  const value = {
    signInWithOAuthProvider: (provider) => signInWithOAuthProvider(provider, onSessionChange),
    signInWithApple: () => signInWithApple(onSessionChange),
    user,
    instaToken,
    loading,
    updateInstaToken,
    setInstaUserId,
    instaUserID,
    getIGDatafromDB,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};