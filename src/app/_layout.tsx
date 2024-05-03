// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthLayout from './(auth)/_layout';
import TabsLayout from './(tabs)/_layout';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthLayout} />
        <Stack.Screen name="Tabs" component={TabsLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
