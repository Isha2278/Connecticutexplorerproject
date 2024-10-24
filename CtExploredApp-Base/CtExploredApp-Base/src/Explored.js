import React from 'react';
import { View, Text, SafeAreaView, Dimensions, StyleSheet } from 'react-native';

import Header from '../components/Header';
import tours from '../assets/json/tours.json';
import CustomFlatList from '../components/CustomFlatList';


/*
  The navigation parameter in Explored({ navigation }) is included to provide access to navigation actions and functions.
  This allows the component to navigate between screens, go back, or perform other navigation tasks.
  Primary Function:
  - Display a list of tours with navigation functionalities to navigate between screens.
*/
export default function Explored({ navigation }) {
    return (
        <View style={styles.container}>
            {/* SafeAreaView to ensure content is visible on devices with notches */}
            <SafeAreaView />
            {/* Header component */}
            <Header />
            {/* CustomFlatList component displaying a list of tours */}
            <CustomFlatList 
                title="Select a Tour"  // Title displayed above the list
                data={tours.trails}    // Data array containing tour information
                navigation={navigation} // Navigation object for navigating between screens
                navigateTo="MapScreen" // Name of the screen to navigate to upon item selection
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        alignItems: 'center'
    },
    card: {
        margin: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 300,
        height: 200,
        margin: 10,
        resizeMode: 'cover',
        borderRadius: 6
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20
    }
});