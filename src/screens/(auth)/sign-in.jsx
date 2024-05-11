import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sign_in } from '../../api/constant/services.js';
// import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import icons from '../../constants/icons.js';
import { useGlobalContext } from '../../contexts/GlobalContext.js';

const SignIn = ({ navigation }) => {
  const { isLogged, setIsLogged, setUser } = useGlobalContext();
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState({
    username: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  console.log(isLogged);
  if (isLogged) {
    navigation.replace('(tabs)', { screen: 'home' });
  }

  const onSubmit = async () => {
    if (form.username === '') {
      return Alert.alert('Invalid Form', 'username can not be empty');
    }

    setSubmit(true);
    setIsLoading(true);
    try {
      // check authentication if right navigate to home else throw error
      const user = await sign_in(form.username);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setIsLogged(true);
      setUser(user);
      // console.log(JSON.parse(await AsyncStorage.getItem("user")));
      navigation.replace('(tabs)', { screen: 'home' });
    } catch (error) {
      Alert.alert('Invalid Sign In', error.message);
    } finally {
      setSubmit(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {isLoading ? (
          <View className="h-full w-full items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="justify-center px-5">
            <View className="w-full mt-[25vh]">
              <View className="flex-row justify-start mb-5">
                <Image
                  source={icons.division}
                  className="w-10 h-10"
                  resizeMode="contain"
                  tintColor="#FF9C01"
                />
                <Text className="text-5xl text-secondary-100 font-bold ml-2">
                  HarnBill
                </Text>
              </View>
              <Text className="text-white text-2xl font-medium">Sign In</Text>
            </View>

            <FormField
              title="username"
              handleChange={(e) => setForm({ ...form, username: e })}
              value={form.username}
              otherStyles="mt-5"
            />
            <CustomButton
              title="Sign In"
              containerStyles="mt-8 items-center h-[55px]"
              handlePress={onSubmit}
              itemsStyles="justify-center"
              isSubmit={submit}
            />

            {/* <Text className="font-pregular text-gray-100 text-lg text-center mt-5">
          Do not have an account?{" "}
          <Link href="/sign-up" className="text-secondary font-semibold">
            Sign Up
          </Link>
        </Text> */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
