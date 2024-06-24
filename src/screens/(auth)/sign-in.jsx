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
import { getUserIdByEmail, getUserData, signIn, signUp } from '../../firebase/services.js';
import auth from '@react-native-firebase/auth';
import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SignIn = ({ navigation }) => {
  const { isLogged, setIsLogged, setUser } = useGlobalContext();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '717910134603-qg7npak4oiql0gi5d9bsir67v7s4gogs.apps.googleusercontent.com',
    });

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
      Alert.alert('Invalid Sign in', error.message);
    } finally {
      setSubmit(false);
      setIsLoading(false);
      setForm({
        phone: '',
      });
    }
  };

  const onGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      console.log(idToken);
      // Alert.alert('success');
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      console.log(userCredential.user.email);
      const existingUser = await getUserIdByEmail(userCredential.user.email);
      let user;
      if (existingUser) {
        user = await getUserData(existingUser);
        // console.log('User already exists:', existingUser);
      } else {
        const userEmail = userCredential.user.email;
        const emailLocalPart = userEmail.split('@')[0];
        user = await signUp(emailLocalPart, '', userEmail);
        console.log('New user created:', user);
      }

      // Set the user as logged in and update the user state
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setIsLogged(true);
      setUser(user);
      console.log(user);
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.log(error.message);
        // switch (error.code) {
        //   case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
        //     // Android and Apple only. No saved credential found, try calling `createAccount`
        //     console.log('NO_SAVED_CREDENTIAL_FOUND');
        //     break;
        //   case statusCodes.SIGN_IN_CANCELLED:
        //     console.log('SIGN_IN_CANCELLED');
        //     // sign in was cancelled
        //     break;
        //   case statusCodes.ONE_TAP_START_FAILED:
        //     // Android and Web only, you probably have hit rate limiting.
        //     // On Android, you can still call `presentExplicitSignIn` in this case.
        //     // On the web, user needs to click the `WebGoogleSigninButton` to sign in.
        //     console.log('ONE_TAP_START_FAILED');
        //     break;
        //   case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        //     // Android-only: play services not available or outdated
        //     // Web: when calling an unimplemented api (requestAuthorization)
        //     console.log('PLAY_SERVICES_NOT_AVAILABLE');
        //     break;
        //   default:
        //   // something else happened
        // }
      }
      console.log(error.message);
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
          <View className="justify-center  px-9">
            <View className="w-full mt-[10vh]">
              <View className="flex-row justify-start mb-5">
                <Logo />
              </View>
              <Text className="text-headline text-2xl font-semibold ">
                Sign In{'  '}
                <MaterialCommunityIcons
                  name="login"
                  color="#111827"
                  size={32}
                  className="ml-2"
                />
              </Text>
            </View>

            <FormField
              title="phone-number"
              handleChange={(e) => setForm({ ...form, phone: e })}
              value={form.phone}
              otherStyles="mt-5"
            />
            <CustomButton
              title="Sign in"
              containerStyles="mt-8 items-center h-[45px]"
              handlePress={onSubmit}
              itemsStyles="justify-center gap-x-2"
              isSubmit={submit}
              // icon="login"
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

            <View className="mt-10 w-full justify-center items-center ">
              <Text className="font-semibold text-stroke text-sm">
                Or sign in with{' '}
              </Text>
              <TouchableOpacity
                onPress={() => onGoogle()}
                className="flex-row mt-2 py-1 px-3 border-2 rounded-lg justify-between items-center border-stroke"
              >
                <Image source={icons.google} className="h-7 w-7" />
                <Text className="font-semibold text-stroke ml-2 text-base ">
                  Google
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
