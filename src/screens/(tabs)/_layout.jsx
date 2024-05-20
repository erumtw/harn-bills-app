import { View, Text, Image, StatusBar } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Create from './create';
import Home from './home';
import Profile from './profile';
import icons from '../../constants/icons';
import Contact from './contact';

const Tabs = createBottomTabNavigator();

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-7 h-7"
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
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
        sceneContainerStyle={{ backgroundColor: '#fef6e4' }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ff8e3c',
          tabBarInactiveTintColor: '#2a2a2a',
          tabBarStyle: {
            backgroundColor: '#fef6e4',
            borderTopWidth: 1,
            borderTopColor: '#fffffe',
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
                icon={icons.home}
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
                icon={icons.plus}
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
                icon={icons.contact}
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
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs.Navigator>

      <StatusBar backgroundColor='#fef6e4' barStyle="dark-content" />
    </>
  );
};

export default TabLayout;
