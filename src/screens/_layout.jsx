// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLayout from './(auth)/_layout';
import TabsLayout from './(tabs)/_layout';
import Group from './group/bill';
import { GlobalProvider } from '../contexts/GlobalContext';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const RootStack = createNativeStackNavigator();
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


const App = () => {
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
  };

  React.useEffect(() => {
    // getToken();
  }, []);

  return (
    <GlobalProvider>
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
    </GlobalProvider>
  );
};

export default App;
