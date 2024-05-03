import {View, Text} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './sign-in';
import SignUp from './sign-up';

const Stack = createNativeStackNavigator();

const AuthLayout = () => {
  return (
      <Stack.Navigator>
         <Stack.Screen name='sign-in' component={SignIn}/>
         <Stack.Screen name='sign-un' component={SignUp}/>
      </Stack.Navigator>
  );
};

export default AuthLayout;
