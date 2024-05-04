import {View, Text} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './sign-in';
// import SignUp from './sign-up.test';

const AuthStack = createNativeStackNavigator();

const AuthLayout = () => {
  return (
      <AuthStack.Navigator>
         <AuthStack.Screen name='sign-in' component={SignIn} options={{headerShown: false}}/>
         {/* <Stack.Screen name='sign-up' component={SignUp} options={{headerShown: false}}/> */}
      </AuthStack.Navigator>
  );
};

export default AuthLayout;
