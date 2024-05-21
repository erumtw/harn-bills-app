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
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { sign_in } from '../../api/constant/services.js';
// import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import icons from '../../constants/icons.js';
import { useGlobalContext } from '../../contexts/GlobalContext.js';
import { Logo } from '../../components/Logo.jsx';
import { signIn } from '../../firebase/services.js';

const SignIn = ({ navigation }) => {
  const { isLogged, setIsLogged, setUser } = useGlobalContext();

  useEffect(() => {
    // console.log(isLogged);
    if (isLogged) {
      navigation.replace('(tabs)', { screen: 'home' });
    }
  }, [isLogged]);

  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState({
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (form.phone === '' || form.phone.replace(/\D/g, '').length !== 10) {
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
      const user = await signIn(form.phone);
      if (!user) {
        Alert.alert(
          'Invalid phone-number',
          'Account not exists, Please sign up',
        );
        return;
      }

      console.log('userData:', user);

      await AsyncStorage.setItem('user', JSON.stringify(user));
      setIsLogged(true);
      setUser(user);

      // navigation.replace('(tabs)', { screen: 'home' });
    } catch (error) {
      Alert.alert('Invalid Sign In', error.message);
    } finally {
      setSubmit(false);
      setIsLoading(false);
      setForm({
        phone: '',
      });
    }
  };

  return (
    <SafeAreaView className="bg-[#fef6e4] h-full">
      <ScrollView>
        {isLoading ? (
          <View className="h-full w-full items-center justify-start">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="justify-center px-9">
            <View className="w-full mt-[20vh]">
              <View className="flex-row justify-start mb-5">
                <Logo />
              </View>
              <Text className="text-headline text-2xl font-semibold">
                SIGN IN
              </Text>
            </View>

            <FormField
              title="phone-number"
              handleChange={(e) => setForm({ ...form, phone: e })}
              value={form.phone}
              otherStyles="mt-5"
            />
            <CustomButton
              title="Sign In"
              containerStyles="mt-8 items-center h-[45px]"
              handlePress={onSubmit}
              itemsStyles="justify-center"
              isSubmit={submit}
            />

            <View className="flex-row items-center justify-center mt-2">
              <Text className="font-medium text-paragraph text-md text-center ">
                Do not have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('sign-up')}>
                <Text className="text-md text-headline font-semibold">
                  Sign Up
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
