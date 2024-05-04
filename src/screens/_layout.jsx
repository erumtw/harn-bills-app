// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLayout from './(auth)/_layout';
import TabsLayout from './(tabs)/_layout';
import Group from './group/bill';

const RootStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Auth">
        <RootStack.Screen
          name="(auth)"
          component={AuthLayout}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="(tabs)"
          component={TabsLayout}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="group"
          component={Group}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
