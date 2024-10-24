
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { supabase } from "../lib/supabase";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../lib/AuthContext'


const hashtag = '#ctexplored';

/*
    This function updates the score of a user based on their Instagram media data.

    Primary Function:
    - UpdateUserScore asynchronously fetches the media data of a user from Instagram using their user ID and access token.
    - It calculates a score based on the fetched media data and a predefined hashtag.
    - Finally, it updates or creates user information in Supabase with the calculated score and the username of the first media item.
*/
const UpdateUserScore = async (token,userId) => {
    

    console.log("token in UpdateUserScore: ", token, "userid", userId)
    try {
        const response = await axios.get(
            `https://graph.instagram.com/${userId}/media?fields=id,caption,username&access_token=${token}`
        );
        console.log("response: ", response)
        const mediaData = response.data.data;
        console.log('mediaData:', mediaData);
        const score = calculateScore(mediaData, hashtag);
        console.log(score);
        console.log(mediaData[0].username);
        updateOrCreateUserInfoInSupabase(score, mediaData[0].username);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
    }
};

/*
    The calculateScore function takes two parameters: posts (an array of posts) and hashtag (the specific hashtag to search for).

    Primary Function:
    - calculateScore computes the score based on the number of posts containing a specific hashtag.
    - It iterates through each post in the provided array of posts and increments the score if the post's caption includes the specified hashtag.
    - The final score is returned after iterating through all posts.

*/
const calculateScore = (posts, hashtag) => {
    let score = 0;
    posts.forEach(post => {
      if (post.caption && post.caption.includes(hashtag)) {
        score++;
      }
    });
    return score;
};


/*
    The updateOrCreateUserInfoInSupabase function manages user data in a Supabase database, either updating existing user scores or creating new user records. 
    It checks if a given username exists in the database; if so, it updates the associated score. 
    If not, it creates a new record with the provided username and score.

    Primary Function:
    - updateOrCreateUserInfoInSupabase updates or creates user information in a Supabase database.
    - It checks if the provided username already exists in the 'userinfo' table.
    - If the username exists, it updates the user's score with the provided score value.
    - If the username doesn't exist, it creates a new record with the username and score.
*/
const updateOrCreateUserInfoInSupabase = async (score, username) => {
    try {
        // Check if the username exists in the 'userinfo' table
        const { data: existingUserInfo, error: existingUserInfoError } = await supabase
            .from('userinfo')
            .select()
            .eq('insta_username', username);
        if (existingUserInfoError) {
            console.error('Error fetching existing user info:', existingUserInfoError);
            return;
        }
        if (existingUserInfo.length > 0) {
            // If the user already exists, update their score
            const { data: updatedUserInfo, error: updateUserInfoError } = await supabase
                .from('userinfo')
                .update({ score })
                .eq('insta_username', username);
            if (updateUserInfoError) {
                console.error('Error updating user info:', updateUserInfoError);
                return;
            }
            console.log('Score updated successfully:', updatedUserInfo );
        } else {
            // If the user does not exist, create a new record with their username and score
            const { data: newUserInfo, error: newUserInfoError } = await supabase
                .from('userinfo')
                .insert([{ insta_username: username, score }]);
                // Insert current associate Auth User with foreign key
                //.insert([{ user_id: user.id, insta_username: username, score }]);
            if (newUserInfoError) {
                console.error('Error creating new user info:', newUserInfoError);
                return;
            }
            console.log('New user info created successfully:', newUserInfo);
        }
    } catch (error) {
        console.error('Error updating or creating user info:', error.message);
    }
}

export { UpdateUserScore }
