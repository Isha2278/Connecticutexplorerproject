import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../src/Style.js';
import MapGuide from '../components/MapGuide.js';


/*
  This function defines the MapScreen component, which is a screen component in React Navigation.
  It takes a 'route' parameter as input, which provides access to information about the current route,
  including route parameters, navigation state, and other route-related data.

  Primary Function:
  - Display details of a specific item received as a parameter from the route.
*/
export default function MapScreen({ route }) {
  // Extract the 'item' parameter from the route
  const { item } = route.params;
  // Use the 'useNavigation' hook to access the navigation object
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [mapGuideVisible, setMapGuideVisible] = useState(true);
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [selectedPOIIndex, setSelectedPOIIndex] = useState(0);


  useEffect(() => {
    if (item.pointsOfInterest.length > 0) {
      animateToPOI(selectedPOIIndex);
    }
  }, [selectedPOIIndex, item]);

  useEffect(() => {
    Animated.timing(buttonOpacity, {
      toValue: mapGuideVisible ? 0 : 1,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [mapGuideVisible]);

  const onCloseMapGuide = () => {
    setMapGuideVisible(false);
  };

  const onReopenMapGuide = () => {
    setMapGuideVisible(true);
  };

  const animateToPOI = (index) => {
    const { latitude, longitude } = item.pointsOfInterest[index];
    mapRef.current.animateToRegion(
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handleNextPress = () => {
    if (selectedPOIIndex < item.pointsOfInterest.length - 1) {
      setSelectedPOIIndex(selectedPOIIndex + 1);
    }
  };

  const handlePreviousPress = () => {
    if (selectedPOIIndex > 0) {
      setSelectedPOIIndex(selectedPOIIndex - 1);
    }
  };

  const handleMarkerPress = (item) => {
    navigation.navigate('DetailView', { item });
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
  
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.header}>
        {navigation.canGoBack() && renderBackButton()}
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {item.pointsOfInterest.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
            onPress={() => handleMarkerPress(item)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{item.id}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      {!mapGuideVisible && (
        <Animated.View style={[styles.floatingButton, { opacity: buttonOpacity }]}>
          <TouchableOpacity onPress={onReopenMapGuide}>
            <Ionicons name="arrow-up" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
      {mapGuideVisible && (
        <MapGuide
          item={item.pointsOfInterest[selectedPOIIndex]}
          onNextPress={handleNextPress}
          onPreviousPress={handlePreviousPress}
          onNavigatePress={(item) => navigation.navigate('DetailView', { item })}
          onClose={onCloseMapGuide}
        />
      )}
    </View>
  );
}
