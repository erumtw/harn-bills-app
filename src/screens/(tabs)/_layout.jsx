import { View, Text, Image, StatusBar } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Create from './create';
import Home from './home';
import Profile from './profile';
import icons from '../../constants/icons';

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
        sceneContainerStyle={{ backgroundColor: '#161622' }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
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


      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
