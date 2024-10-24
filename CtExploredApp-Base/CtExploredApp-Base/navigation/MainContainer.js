// import react native (expo) components 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens from source folder
import Explored from '../src/Explored';
import DetailView from '../src/DetailView';
import MapScreen from '../src/MapScreen';
import Saved from '../src/Saved';
import Leaderboard from '../src/leaderboard';

// Define screen names
const explored = 'Explored';
const saved = 'Saved';
const savedScreen = 'SavedScreen';
const leaderboard = 'Leaderboard';

// Create tab navigator and stack navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/*
  The ExploredStack function defines a stack navigator for three screens: Explored, DetailView, and MapScreen.
  Each screen is represented by a Stack.Screen component with its respective name and component.
  The options prop is used to customize the navigation header, setting it to not be shown in this case.

  Primary Function:
  - Define a stack navigator for navigating between the Explored, DetailView, and MapScreen screens.
  - Customize navigation header options to hide the header.
*/
function ExploredStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ExploredPage' component={Explored} options={{ headerShown: false }} />
      <Stack.Screen name='DetailView' component={DetailView} options={{ headerShown: false }} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}


/*
  The SavedStack function defines a stack navigator for two screens: Saved and DetailView.
  Each screen is represented by a Stack.Screen component with its respective name and component.
  The options prop is used to customize the navigation header, setting it to not be shown in this case.

  Primary Function:
  - Define a stack navigator for navigating between the Saved and DetailView screens.
  - Customize navigation header options to hide the header.
*/
function SavedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={savedScreen} component={Saved} options={{ headerShown: false }} />
      <Stack.Screen name='DetailView' component={DetailView} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}


/*
  
  The MainContainer function serves as the main navigation container for the application.
  It wraps the navigation elements within a NavigationContainer component from React Navigation.
  The tab navigator contains three tab screens: Explored, Saved, and Leaderboard.
  The initialRouteName prop specifies that the app should start with the Explored screen.

  Primary Function:
  - Define the main navigation structure of the application using a bottom tab navigator.
*/
export default function MainContainer() {
  return (
    <NavigationContainer>
      {/* Bottom tab navigator */}
      <Tab.Navigator
        // Start the app with explored screen
        initialRouteName={explored}
        screenOptions={({route}) => ({
          // Configure tab bar icons
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;
            if(rn === explored){
              iconName = focused ? 'map' : 'map-outline';
            } else if (rn === saved){
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else if (rn === leaderboard){
              iconName = focused ? 'star' : 'star-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // Configure tab bar colors and styles
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: {
            fontSize: 12
          },
          tabBarStyle: {paddingTop: 5}
        })}
      >
        {/* Define tab screens */}
        <Tab.Screen name={explored} component={ExploredStack} options={{ headerShown: false }} />
        <Tab.Screen name={saved} component={SavedStack} options={{ headerShown: false }} />
        <Tab.Screen name={leaderboard} component={Leaderboard} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
