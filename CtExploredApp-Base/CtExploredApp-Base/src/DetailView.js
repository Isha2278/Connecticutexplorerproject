import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity, ScrollView, Platform, Modal, StyleSheet, AppState, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { AuthContext } from '../lib/AuthContext'
import styles from '../src/Style.js';
import { UpdateUserScore } from '../lib/UpdateUserScore';
import * as Location from 'expo-location'; // Import Expo Location


/*
  This function defines the DetailView component, which is a screen component in React Navigation.
  It takes a 'route' parameter as input, which provides access to information about the current route,
  including route parameters, navigation state, and other route-related data.

  Primary Function:
  - Display details of a specific item received as a parameter from the route.
*/
export default function DetailView({ route }) {
  // Extract the 'item' parameter from the route
  const { item } = route.params;
  // Use the 'useNavigation' hook to access the navigation object
  const navigation = useNavigation();
  const { user, instaToken, instaUserID, setInstaUserId, updateInstaToken, signInWithOAuthProvider, signInWithApple } = useContext(AuthContext);

  const [isModalVisible, setModalVisible] = useState(false);
  const [awaitIgReturn, setAwaitIgReturn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [near, setNear] = useState(true);

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  const handleLocationCheck = async () => {
    try {
      //const isNear = await checkIfNearTarget(item.latitude, item.longitude);
      if (near) {
        // User is near the target coordinates
        console.log('User is near the target coordinates.');
        // Take appropriate action here
        setModalVisible(true);
        setNear(true);
      } else {
        // User is not near the target coordinates
        console.log('User is not near the target coordinates.');
        setModalVisible(true);
        setNear(false);
        // Take appropriate action here
      }
    } catch (error) {
      console.error('Error checking location:', error);
    }
  };

  async function checkIfNearTarget(targetLat, targetLon) {
    if (!userLocation) {
      // If user location is not available, get it first
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return false;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log(location)
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (error) {
        console.error('Error getting user location:', error);
        return false;
      }
    }

    const distance = getDistance(userLocation.latitude, userLocation.longitude, targetLat, targetLon);
    const threshold = 1; //  threshold distance, in kilometers
    return distance <= threshold;
  }


  // Async function to handle browser/native oauth, seperate Apple & TODO: Android Google flow
  const handleAuthentication = async (provider) => {
    try {
      // Seperate flow for apple using IOS native API
      if (provider === "apple") {
        await signInWithApple();
      } else {
        await signInWithOAuthProvider(provider);
      }
    } catch (error) {
      console.error("Authentication error: ", error);
    }
  };

  // Handle Checking Saved State & Updating State 

  useEffect(() => {
    checkSavedStatus();
  }, []);

  const checkSavedStatus = async () => {
    try {
      const savedLocations = await AsyncStorage.getItem('saved_locations');
      if (savedLocations) {
        const existingLocations = JSON.parse(savedLocations);
        const isLocationSaved = existingLocations.some(location => location.fullId === item.fullId);
        setIsSaved(isLocationSaved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const saveLocation = async () => {
    try {
      let savedLocations = await AsyncStorage.getItem('saved_locations');
      savedLocations = savedLocations ? JSON.parse(savedLocations) : [];

      const existingIndex = savedLocations.findIndex(location => location.fullId === item.fullId);
      if (existingIndex !== -1) {
        savedLocations.splice(existingIndex, 1);
        setIsSaved(false);
      } else {
        // poi.tourId=poi.fullId;
        savedLocations.push(item);
        setIsSaved(true);
      }

      await AsyncStorage.setItem('saved_locations', JSON.stringify(savedLocations));
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  /*
    This function renders a back button component that allows the user to navigate back to the previous screen.
    It utilizes the 'navigation' object to access the 'goBack' function, which triggers the navigation action.

    Primary Function:
    - Render a back button component that enables navigation to the previous screen when pressed.
  */
  const renderBackButton = () => (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );

  // Address Link 
  const openMap = () => {
    const address = encodeURIComponent(item.address);
    let url = '';
    if (Platform.OS === 'ios') {
      url = `maps://app?q=${address}`;
    } else if (Platform.OS === 'android') {
      url = `geo:0,0?q=${address}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    }
    Linking.openURL(url);
  };

  /*
    This function extracts query parameters from a given URL string.
    It parses the query string portion of the URL and returns an object containing key-value pairs of query parameters.

    Primary Function:
    - Extract query parameters from a URL string and return them as an object.

    Example:
    - Input URL: 'https://examplecode.com/path?param1=value1&param2=value2'
    - Return Object: { param1: 'value1', param2: 'value2' }
  */
  function extractQueryParameters(url) {
    const queryString = url.includes("#") ? url.split("#")[1] : url;

    const params = queryString.split("&").reduce((result, pair) => {
      const [key, value] = pair.split("=");

      // decode to get the original characters like space etc.
      result[decodeURIComponent(key)] = decodeURIComponent(value);
      return result;
    }, {});

    return params;
  }

  /*
    This function opens the Instagram authorization URL in a web browser to initiate the OAuth 2.0 authentication process.
    After the user completes the authentication flow on Instagram's website, the function captures the authorization code from the redirected URL.
    It then uses the obtained authorization code to exchange it for an Instagram access token.

    Primary Function:
    - Initiates the Instagram OAuth 2.0 authentication process and exchanges the obtained authorization code for an access token.
    - Instagram authorization URL: 'https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile,user_media&response_type=code'
  */
  const openInstagramAuthUrl = async () => {
    const redirectUri = 'https://twtrtcscyltrruxhgnvo.supabase.co/functions/v1/igexchange';
    const clientId = '6988565697859554';
    const scope = 'user_profile,user_media';
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
    console.log(authUrl);
    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl);
      // Check if the authorization process was successful
      if (result.type === 'success') {
        console.log(result);
        const queryParameters = extractQueryParameters(result.url);
        console.log(queryParameters.igcode);
        console.log(queryParameters.userId);
        uid = user.identities[0].user_id
        updateInstagramAccessToken(uid, queryParameters.igcode, queryParameters.userId)
      }
    } catch (error) {
      console.error('Error opening Instagram authorization URL:', error);
    }
  };

  /*
    This function updates the Instagram access token associated with a user after a successful authentication process.
    Primary Function:
    - Receives two parameters: user_id (the ID of the authenticated user) and access_token (the access token obtained during authentication).
    - Calls the updateInstaToken function with the access token as an argument to update the Instagram access token in the application state.
    - Sets the modal visibility to false, indicating that the authentication modal should be closed after the token update.
  */
  const updateInstagramAccessToken = async (user_id, access_token, ig_uid) => {
    console.log("userId:", user_id);
    console.log("accessToken in updateInstagramAccessToken:", access_token);
    setInstaUserId(ig_uid);
    updateInstaToken(user_id, access_token, ig_uid);
    setModalVisible(false);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync('#ctexplored');
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active' && user && instaToken) {
        console.log('App has come to the foreground attempting to update score');
        console.log('IG UserID ' + instaUserID);
        console.log('IG token ' + instaToken);
        try {
          await UpdateUserScore(instaToken, instaUserID);
          setAwaitIgReturn(false);
        } catch (error) {
          console.error('Error updating user score:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isModalVisible]);


  useEffect(() => {
    console.log("Stored Token", instaToken);
    // Any other actions that depend on instaToken
  }, [instaToken]);

  /*
    This function handles incoming URIs (Uniform Resource Identifiers) from the application.
    URIs are used to identify and locate resources on the internet or within an application.

    Primary Function:
    - Receives an event object containing the URI.
    - Parses the URI to extract relevant parameters, such as 'igcode' and 'userId'.
    - Calls the necessary functions to update the Instagram access token, set the Instagram user ID, and close any associated modal views.
  */
  const handleIncomingLink = async (event) => {
    // Get the URL from the event
    const deepLink = event.url;
    console.log('Deep link:', deepLink);
    // Parse the URL to extract the data parameter
    const urlParts = deepLink.split('#');
    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const params = new URLSearchParams(queryString);
      const encodedToken = params.get('igcode'); // Change 'data' to 'igcode'
      const userId = params.get('userId'); // Extract userId parameter
      // Call the function to store long life token in auth
      setInstaUserId(userId);
      updateInstaToken(encodedToken);
      setModalVisible(false);
    }
  };

  /*
    This useEffect hook adds an event listener to handle incoming links when the component mounts.
    It specifically checks if the Linking API is supported on the current platform (iOS or Android).
    If supported, it attaches the handleIncomingLink function to the 'url' event.
    Additionally, it removes the event listener when the component unmounts to avoid memory leaks.
  */
  useEffect(() => {
    // Add event listener to handle incoming links only if Linking is supported
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Linking.addEventListener('url', handleIncomingLink);
      // Remove event listener when the component unmounts
      return () => {
        if (Linking.removeEventListener) {
          Linking.removeEventListener('url', handleIncomingLink);
        }
      };
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView />
        <View style={styles.header}>
          {navigation.canGoBack() && renderBackButton()}
          <Text style={styles.title}>Stop {item.id}: {item.title}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.mapMarkerContainer} onPress={openMap}>
            <Ionicons name="location" size={24} color="#007BFF" />
            <Text style={styles.mapMarkerText}>{item.address}</Text>
          </TouchableOpacity>
          <Text style={styles.description}>{item.description}</Text>
        </ScrollView>

        <View style={styles.socialLinksContainer}>

          <TouchableOpacity style={styles.socialLink} onPress={() => handleLocationCheck()}>
            <Ionicons name="logo-instagram" size={24} color="#E4405F" style={styles.socialIcon} />
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>
          {/* Save this location */}
          <TouchableOpacity style={styles.socialLink} onPress={saveLocation}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color="#E4405F" style={styles.socialIcon} />
            <Text style={styles.socialText}>{isSaved ? 'Unsave' : 'Save'}</Text>
          </TouchableOpacity>
          {/* Read More Link */}
          <TouchableOpacity style={styles.socialLink} onPress={() => Linking.openURL('https://ctexplored.org')}>
            <Ionicons name="open-outline" size={24} color="#E4405F" style={styles.socialIcon} />
            <Text style={styles.socialText}>Read More</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Modals for Various Authentication States */}

      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#aaa" />
            </TouchableOpacity>
            {user && instaToken && near ? (
              <>
                <Text style={styles.modalTitle}>Post to Instagram</Text>
                <TouchableOpacity style={[styles.loginButton, { backgroundColor: "#00F" }]} onPress={copyToClipboard}>
                  <Text style={styles.copyButtonText}>Copy #ctexplored</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setAwaitIgReturn(true);
                    Linking.openURL("https://instagram.com");
                  }}
                  style={[styles.loginButton, { backgroundColor: "#888" }]}
                >
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons
                      name="instagram"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Post to Instagram</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : user && !instaToken && near ? (
              <>
                <Text style={styles.modalTitle}>Link Instagram Account</Text>
                <TouchableOpacity
                  onPress={() => {
                    openInstagramAuthUrl();
                  }}
                  style={[styles.loginButton, { backgroundColor: "#000000" }]}
                >
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons
                      name="instagram"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Link Instagram Account</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : !near ? (
              <>
                <Text style={styles.modalTitle}>You are not at the right location</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Login to Continue</Text>
                {/* Render content for logging in */}
                <View style={styles.loginOptions}>
                  <TouchableOpacity
                    onPress={() => handleAuthentication("google")}
                    style={[styles.loginButton, { backgroundColor: "#DB4437" }]}
                  >
                    <View style={styles.buttonContent}>
                      <AntDesign name="google" size={24} color="white" />
                      <Text style={styles.buttonText}>Sign in with Google</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAuthentication("facebook")}
                    style={[styles.loginButton, { backgroundColor: "#3B5998" }]}
                  >
                    <View style={styles.buttonContent}>
                      <FontAwesome name="facebook" size={24} color="white" />
                      <Text style={styles.buttonText}>Sign in with Facebook</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAuthentication("apple")}
                    style={[styles.loginButton, { backgroundColor: "#000000" }]}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons name="apple" size={24} color="white" />
                      <Text style={styles.buttonText}>Sign in with Apple</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};