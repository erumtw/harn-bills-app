import { View, Text, Image, StatusBar } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Create from './create';
import Home from './home';
import Profile from './profile';
import icons from '../../constants/icons';
import Contact from './contact';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tabs = createBottomTabNavigator();

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-1 ">
      {/* <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-9 h-9"
      /> */}
      <MaterialCommunityIcons name={icon} color={color} size={36}/>

      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  // const { isLoading, isLoggedIn } = useGlobalContext();

  // if (!isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs.Navigator
        sceneContainerStyle={{
          backgroundColor: '#fef6e4',
        }}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ff8e3c',
          tabBarInactiveTintColor: '#2a2a2a',
          tabBarStyle: {
            backgroundColor: '#fffff4',
            borderTopWidth: 1,
            borderTopColor: '#fffff4',
            height: 70,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          component={Home}
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="home-circle"
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          component={Create}
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="plus-circle"
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="contact"
          component={Contact}
          options={{
            title: 'Contact',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="account-supervisor-circle"
                color={color}
                name="Contact"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          component={Profile}
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="account-circle"
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs.Navigator>

      <StatusBar backgroundColor="#fef6e4" barStyle="dark-content" />
    </>
  );
};

export default TabLayout;
