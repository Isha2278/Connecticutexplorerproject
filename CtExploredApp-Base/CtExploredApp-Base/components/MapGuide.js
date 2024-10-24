import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../src/Style';

export default function MapGuide({ item, onNextPress, onPreviousPress, onNavigatePress, onClose }) {
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

  const closeWindow = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });

  const onGestureEvent = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { velocityY } = event.nativeEvent;
      if (velocityY > 250) { // Adjust swipe velocity to close widget here
        closeWindow();
      }
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
      <Animated.View style={[styles.mapGuideContainer, { transform: [{ translateY }] }]}>
        <View style={styles.mapGuideInnerContainer}>
          <TouchableOpacity onPress={() => onNavigatePress(item)} style={styles.mapGuideImageButton}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.mapGuideImage}
            />
          </TouchableOpacity>
          <View style={styles.mapGuideTextContainer}>
            <TouchableOpacity onPress={() => onNavigatePress(item)} style={styles.MapGuideTitleContainer}>
              <Text style={styles.mapGuideTitle}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.mapGuideButtonContainer}>
              <TouchableOpacity onPress={onPreviousPress} style={[styles.mapGuideButton, styles.mapGuideBlueButton]}>
                <Ionicons name="chevron-back-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNextPress} style={[styles.mapGuideButton, styles.mapGuideBlueButton]}>
                <Ionicons name="chevron-forward-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};
