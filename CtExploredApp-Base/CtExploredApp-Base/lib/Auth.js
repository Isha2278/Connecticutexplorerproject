//Author: Marek Grabowski

import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';



// Prepare Web broswer when the modal opens for use in flow
const maybeCompleteAuthSession = () => {
  WebBrowser.maybeCompleteAuthSession();
};

const logout = async () => {
  try {
    await supabase.auth.signOut();

    console.log('User successfully signed out!');
  } catch (error) {
    console.error('Failed to sign out:', error);
  }
};


// Generic OAuth provider login
const signInWithOAuthProvider = async (provider, onSessionChange) => {
  const redirectTo = makeRedirectUri();
  console.log(`Initiating sign-in with ${provider}...`);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      console.error(`Error during ${provider} sign-in:`, error);
      return;
    }

    const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo, {
      useCustomTabs: true,
    });

    if (res.type === 'success') {
      await createSessionFromUrl(res.url, onSessionChange);
    }
  } catch (e) {
    console.error(`Exception in signInWithOAuthProvider (${provider}):`, e);
  }
};

// Apple sign-in
const signInWithApple = async (onSessionChange) => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        console.error('Error logging in:', error);
        return;
      }

      if (data.session) {
        onSessionChange(data.session);
      }
    } else {
      throw new Error('No identityToken.');
    }
  } catch (e) {
    console.error('Error during Apple sign-in:', e);
  }
};

// Create session from URL
const createSessionFromUrl = async (url, onSessionChange) => {
  // Split string returned by Oauth Flow into fragments, containing parameters & their lables
  const fragmentString = url.split('#')[1];
  if (!fragmentString) {
    console.error('No fragment found in URL.');
    return;
  }

  const queryParams = fragmentString.split('&').reduce((acc, pair) => {
    // Get the parameters from each fragment
    const [key, value] = pair.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});

  // Get the access_token and refresh_token to store in the DB for future login
  const { access_token, refresh_token } = queryParams;

  try {
    // Start User Session within the App
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });

    if (error) {
      console.error('Error setting session:', error);
      return;
    }
    console.log(data.session);

    if (data.session) {
      onSessionChange(data.session);
    }
  } catch (e) {
    console.error('Exception in createSessionFromUrl:', e);
  }
};

export { maybeCompleteAuthSession, signInWithOAuthProvider, signInWithApple, logout };
