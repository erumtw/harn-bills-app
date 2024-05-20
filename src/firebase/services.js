import { Filter, firestore } from '@react-native-firebase/firestore';

import { firebase } from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const db = firebase.firestore();

export const getUserId = async (phone) => {
  const userSnapshot = await db
    .collection('users')
    .where('phone', '==', phone)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0];
  return userDoc.id;
};

export const getUserData = async (userId) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData;
    } else {
      console.log(userId, ' not exist');
      return null;
    }
  } catch (error) {
    console.log(error.message);
    // throw error;
  }
};

export const signIn = async (phone) => {
  try {
    const userId = await getUserId(phone);
    if (userId) {
      const userData = await getUserData(userId);
      console.log('Sign In Success for ', userData.username);

      return userData;
    }
  } catch (error) {
    console.log(error.message);
    // throw error;
  }
};

export const signUp = async (username, phone) => {
  try {
    // Check if the user already exists
    const existingUser = await getUserId(phone);
    if (existingUser) {
      Alert.alert('Sign Up Invalid', 'This phone number is already in use.');
      return;
    }

    // Create a new user document
    const newUser = {
      username: username,
      phone: phone,
      image: '',
      contacts: [],
    };

    const docRef = await db.collection('users').add(newUser);
    console.log('Document written with ID: ', docRef.id);

    // Get the newly created user data
    const userDoc = await docRef.get();
    const userData = userDoc.data();

    return userData;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error; // Rethrow the error for further handling
  }
};

export const getUserUnpaidBill = async (userId) => {};
