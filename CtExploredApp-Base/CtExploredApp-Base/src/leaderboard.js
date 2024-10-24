import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import the FontAwesome5 icon library
import CryptoJS from 'crypto-js';
// import { supabase } from "../lib/supabase"; // Import the Supabase client
import { supabase } from '../lib/supabase'; // Ensure this path is correct
import { Picker } from '@react-native-picker/picker'; // Import the Picker component from @react-native-picker/picker
import styles from '../src/Style.js';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../lib/AuthContext'
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function Leaderboard () {
  const [currentUsername, setcurrentUsername] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [authenticatedUserItem, setAuthenticatedUserItem] = useState([]);
  const { user, instaToken, instaUserID, setInstaUserId, updateInstaToken, signInWithOAuthProvider, signInWithApple } = useContext(AuthContext);
  console.log("Leaderboard Start Here")
  
  /*
    The useEffect hook is employed to execute the 'fetchData' function when the component mounts, ensuring data retrieval occurs just once during initialization.

    Primary Function:
    - Fetch data from a data source and initialize component state upon component mount.
  */
  useEffect(() => {
    fetchData();
    fetchToken();
  }, []);

  /*
    The useFocusEffect hook is utilized to refresh the leaderboard data each time the user navigates to the "Leaderboard" screen.
    It employs a callback function triggered upon screen focus, which in turn calls the 'fetchData' function to update the leaderboard data.

    Primary Function:
    - Automatically refresh leaderboard data when the user navigates to the "Leaderboard" screen to ensure up-to-date information is displayed.
  */
  useFocusEffect(
    React.useCallback(() => {
        // This callback will be called when the screen gains focus
        fetchData(); // Update the score when the leaderboard screen gains focus
    }, [])
  );

  
  /*
    The fetchData function is responsible for retrieving user information data from the Supabase database asynchronously.
    Upon successful retrieval, it processes the data and sorts it based on score, updating the component's state accordingly.

    Primary Function:
    - Asynchronously fetch user information data from Supabase, process it, and sort it based on score.
  */
  const fetchData = async () => {
    try {
      // Fetch userinfo data from Supabase
      const { data: userinfoData, error } = await supabase
        .from('userinfo')
        .select('user_id, insta_username, score');
      if (error) {
        console.error('Error fetching data from Supabase:', error.message);
        return;
      }
      if (userinfoData) {
        const processedData = processData(userinfoData);
        sortData(processedData); // Sort data based on score
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const fetchToken = async () => {
    console.log('fetchToken Start HERE!');
    if (user) {
      // If available, Get Instagram Info from DB
      try {
        // Fetch userinfo data from Supabase
        console.log("Attempting to fetch IG data");
  
        const { data, error } = await supabase
          .from("user")
          .select("id, insta_token, instagram_id")
          .single(); // If you expect one record, use single()
  
        if (error) {
          console.error("Error fetching data from Supabase:", error.message);
          return; // Exit function on error
        }
  
        if (data) {
          // Log the fetched data
          console.log('ID:', data.id);
          console.log('Insta Token:', data.insta_token);
          console.log('Instagram ID:', data.instagram_id);
  
          // Make API call to get username from Instagram
          const response = await fetch(`https://graph.instagram.com/v19.0/${data.instagram_id}?fields=id,username&access_token=${data.insta_token}`);
          const userData = await response.json();
  
          if (userData.username) {
            // Set username to state variable
            setcurrentUsername(userData.username);
            console.log('Current User:', userData.username); // Print current user in console
          } else {
            console.error("Error fetching username from Instagram");
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    } else {
      console.log("User not logged in");
    }
  };

  /*
    The processData function is responsible for processing the user information data retrieved from the Supabase database.
    It iterates through each item in the data array, extracting relevant information such as user ID, Instagram username,
    and score, and then constructs a new array containing this processed data. The processed data is returned for further use.

    Primary Function:
    - Process the user information data obtained from Supabase, extracting relevant information and organizing it into a new array.
  */
  const processData = (data) => {
    const processedData = [];
    data.forEach((item, index) => {
      const { user_id, insta_username: username, score } = item;
      processedData.push({ id: index.toString(), user_id, username, score });
    });
    return processedData;
  };
  
  /*
    The sortData function sorts the given data array based on the score in descending order (from high to low).
    It utilizes the Array.sort() method with a custom comparison function to achieve this sorting order.
    After sorting the data, the function updates the state variable leaderboardData with the sorted array.

    Primary Function:
    - Sort the data array based on the score in descending order (from high to low).
    - Update the state variable leaderboardData with the sorted array.
  */
  const sortData = (data) => {
    // Sort data based on score (high to low)
    const sortedData = data.sort((a, b) => b.score - a.score);
    setLeaderboardData(sortedData);
  };

  const flatListRef = useRef(null);

  return (
    <View style={styles.container}>
    <Header />

    <View style={styles.LeaderHeader}>
      <FontAwesome5Icon name="medal" size={22} color="gold" style={styles.iconStyle} />
      <Text style={styles.LeaderTitle}>Leaderboard</Text>
      <FontAwesome5Icon name="medal" size={22} color="gold" style={styles.iconStyle} />
    </View>

    {user && (
      <TouchableOpacity onPress={() => {
        const userIndex = leaderboardData.findIndex(item => item.username === currentUsername);
        if (userIndex !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: userIndex });
        }
      }}>
        <View style={[styles.currentUser, customStyles.highlightedRow]}>
          <Text style={styles.rank}>
            {leaderboardData.length > 0 ? (() => {
              const userScoreItem = leaderboardData.find(item => item.username === currentUsername);
              if (userScoreItem) {
                const userRank = leaderboardData.findIndex(item => item.username === currentUsername) + 1;
                return userRank;
              } else {
                return 'N/A';
              }
            })() : 'Loading...'}
          </Text>
          <Text style={styles.username}>{currentUsername}</Text>
          <Text style={styles.itemTitle}>
            {leaderboardData.length > 0 ? (() => {
              const userScoreItem = leaderboardData.find(item => item.username === currentUsername);
              return userScoreItem ? userScoreItem.score : 'N/A';
            })() : 'Loading...'}
          </Text>
        </View>
      </TouchableOpacity>
    )}

      <View style={styles.columnTitlesContainer}>
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>Rank</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={styles.userScoreContainer}>
          <Text style={styles.itemTitle}>Score</Text>
        </View>
      </View>

    <FlatList
      ref={flatListRef}
      data={leaderboardData}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.flatlistContainer}
      style={styles.flatlistBorder}
      renderItem={({ item, index }) => (
        <View style={[styles.leaderboardItem, user && item.username === currentUsername && customStyles.highlightedRow]}>
          <View style={styles.rankContainer}>
            {index === 0 && <Image source={require('../assets/icons8-1st-place-medal-48.png')} style={styles.imageStyle}/>}
            {index === 1 && <Image source={require('../assets/icons8-2nd-place-medal-48.png')} style={styles.imageStyle}/>}
            {index === 2 && <Image source={require('../assets/icons8-3rd-place-medal-48.png')} style={styles.imageStyle}/>}
            {(index !== 0 && index !== 1 && index !== 2) && <Text style={styles.rank}>{index + 1}</Text>}
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.username}>{item.username}</Text>
          </View>
          <View style={styles.userScoreContainer}>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        </View>
      )}
    />

    </View>
  );  
};

const customStyles = StyleSheet.create({
  highlightedRow: {
    backgroundColor: '#FFD700', // Yellow color for highlighted row
  },
});
