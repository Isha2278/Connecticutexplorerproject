import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../src/Style.js';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Header from '../components/Header.js';
import CustomFlatList from '../components/CustomFlatList.js';

export default function Saved({ navigation }) {
    const isFocused = useIsFocused();
    const [savedLocations, setSavedLocations] = useState([]);

    useEffect(() => {
        if (isFocused) {
            loadSavedLocations();
        }
    }, [isFocused]);

    const loadSavedLocations = async () => {
        try {
            const savedLocationsData = await AsyncStorage.getItem('saved_locations');
            console.log(savedLocationsData);
            if (savedLocationsData !== null) {
                setSavedLocations(JSON.parse(savedLocationsData));
            }
        console.log(savedLocations)
        } catch (error) {
            console.error('Error loading saved locations:', error);
        }
    };

    const handleLocationPress = (location) => {
        // Navigate to detail view of the saved location
        // You can implement this according to your navigation structure
        navigation.navigate('DetailView', { poi: location });
    };

    return (
        <>
        <View style={styles.ExploredAndSavedContainer}>
            <SafeAreaView />
            <Header/>
            <CustomFlatList title="Saved Locations" data={savedLocations} navigation={navigation} navigateTo = 'DetailView'/>
            
        </View>
        </>
    );
};
