/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// In App.js in a new project

import * as React from 'react';
import { View, Text, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/Homescreen'
import ScanBeacons from './screens/ScanBeacons'
import UpdateKey from './screens/UpdateKey'
import StartScreen from './screens/Start'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

const Stack = createStackNavigator();

function Header(){
  return(
    <View style={{height: 100, backgroundColor: '#f27b27', width: '100%'}}>
      <View style={{height: 50, backgroundColor: '#111', width: '100%'}}>

      </View>

    </View>
  )
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start"
      screenOptions ={{
        headerStyle: {
          backgroundColor: '#002d4e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center'
      }}>
      <Stack.Screen name="Start" component={StartScreen} options={{headerShown: false}}/>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          
          title: 'Home',
        }}
      />
        <Stack.Screen name="ScanBeacons" component={ScanBeacons} options={{title: 'Sensor scanner'}} />
        <Stack.Screen name="UpdateKey" component={UpdateKey} options={{title: 'Change label'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;