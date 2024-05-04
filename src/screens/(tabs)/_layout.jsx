import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Create from './create';
import Home from './home';
import Profile from './profile';

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Home} options={{headerShown: false}}/>
      {/* <Tab.Screen name="create" component={Create} options={{headerShown: false}}/> */}
      <Tab.Screen name="profile" component={Profile} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
};

export default TabLayout;
