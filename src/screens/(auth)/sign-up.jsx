import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
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
import { Logo } from '../../components/Logo.jsx';
import { signUp } from '../../firebase/services.js';

const SignIn = ({ navigation }) => {
  const { isLogged, setIsLogged, setUser } = useGlobalContext();

  console.log(isLogged);
  if (isLogged) {
    navigation.replace('(tabs)', { screen: 'home' });
  }

  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState({
    username: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (
      form.username === '' ||
      form.phone === '' ||
      form.phone.replace(/\D/g, '').length !== 10
    ) {
      Alert.alert(
        'Invalid Form',
        'field can not be empty, and phone-number must be digit of 10 length',
      );
      return;
    }

    setSubmit(true);
    setIsLoading(true);
    try {
      // check authentication if right navigate to home else throw error
      const user = await signUp(form.username, form.phone);
      console.log(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setIsLogged(true);
      setUser(user);
      console.log(JSON.parse(await AsyncStorage.getItem('user')));
      navigation.replace('(tabs)', { screen: 'home' });
    } catch (error) {
      Alert.alert('Invalid Sign Up', error.message);
    } finally {
      setSubmit(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#fef6e4] h-full">
      <ScrollView>
        {isLoading ? (
          <View className="h-full w-full items-center justify-start">
            <ActivityIndicator style={{ flex: 1 }} />
          </View>
        ) : (
          <View className="justify-center px-9">
            <View className="w-full mt-[17vh]">
              <View className="flex-row justify-start ">
                <Logo />
              </View>
              <Text className="text-headline text-2xl font-bold">SIGN UP</Text>
            </View>

            <FormField
              title="username"
              handleChange={(e) => setForm({ ...form, username: e })}
              value={form.username}
              otherStyles="mt-5"
            />

            <FormField
              title="phone-number"
              handleChange={(e) => setForm({ ...form, phone: e })}
              value={form.phone}
              otherStyles="mt-5"
            />

            <CustomButton
              title="Sign Up"
              containerStyles="mt-8 items-center h-[45px]"
              handlePress={onSubmit}
              itemsStyles="justify-center"
              isSubmit={submit}
            />

            <View className="flex-row items-center justify-center mt-2">
              <Text className="font-medium text-paragraph text-md text-center ">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('sign-in')}>
                <Text className="text-md text-headline font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
