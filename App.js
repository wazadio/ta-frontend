import React, { useEffect } from 'react';
import {Text, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Home from './src/screens/Home';
import AccountScreen from './src/screens/AccountScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateAccount from './src/screens/CreateAccount';
import ImportAccount from './src/screens/ImportAccount';
import Login from './src/screens/Login';


const Stack = createNativeStackNavigator()

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  },[])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name='AccountList'
          component={AccountScreen}
        />
        <Stack.Screen
          name='CreateAccount'
          component={CreateAccount}
        />
        <Stack.Screen
          name='ImportAccount'
          component={ImportAccount}
        />
        <Stack.Screen
          name='Login'
          component={Login}
        />
        <Stack.Screen
          name='Home'
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
