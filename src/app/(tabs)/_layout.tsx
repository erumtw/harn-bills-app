import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Create from './create';
import Home from './home';
import Profile from './profile';

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabLayout;
