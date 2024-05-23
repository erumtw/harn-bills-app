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
      userData.id = userId;
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
      console.log('Sign In Success for ', userData);
      // console.log(userData);
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
    userData.id = userDoc.id;

    return userData;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error; // Rethrow the error for further handling
  }
};

export const getUserBills = async (user) => {
  try {
    const billQuery = db
      .collection('bills')
      .where('members', 'array-contains-any', [
        {
          memberPhone: user.phone,
          membername: user.username,
          isPaid: false,
        },
        {
          memberPhone: user.phone,
          membername: user.username,
          isPaid: true,
        },
      ]);

    const querySnapshot = await billQuery.get();

    const userBills = [];

    querySnapshot.forEach((doc) => {
      const billData = doc.data();
      billData.id = doc.id;
      userBills.push(billData);
    });

    return userBills;
  } catch (error) {}
};

export const getUserUnpaidBill = async (user) => {
  try {
    const billQuery = db
      .collection('bills')
      .where('members', 'array-contains-any', [
        {
          memberPhone: user.phone,
          membername: user.username,
          isPaid: false,
        },
      ]);

    const querySnapshot = await billQuery.get();

    const userUnpaidBills = [];

    querySnapshot.forEach((doc) => {
      const billData = doc.data();
      billData.id = doc.id;
      userUnpaidBills.push(billData);
    });

    return userUnpaidBills;
  } catch (error) {}
};

export const getUserBillDividedPrice = async (userPhone, billId) => {
  try {
    let sum = 0;
    const billItemsQuery = await db
      .collection('items')
      .where('bill_id', '==', billId)
      .where('divider', 'array-contains', userPhone)
      .get();

    billItemsQuery.forEach((doc) => {
      const item = doc.data();
      // console.log("item:", item);
      const divided_price = item.price / item.divider.length;
      sum += divided_price;
    });

    return parseFloat(sum).toFixed(1);
  } catch (error) {
    console.log(error.message);
  }
};

export const getBillTotalPrice = async (billId) => {
  try {
    let sum = 0;
    const itemsQuery = await db
      .collection('items')
      .where('bill_id', '==', billId)
      .get();

    itemsQuery.forEach((doc) => {
      const itemData = doc.data();
      sum += itemData.price;
    });

    return parseFloat(sum).toFixed(1);
  } catch (error) {
    console.log(error.message);
  }
};

export const getBillItems = async (billId) => {
  try {
    const itemQuery = await db
      .collection('items')
      .where('bill_id', '==', billId)
      .get();

    const itemsData = [];
    itemQuery.forEach((doc) => {
      const itemSnapshot = doc.data();
      itemsData.push(itemSnapshot);
    });

    return itemsData;
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserTotalOutcome = async (user) => {
  try {
    let totalOutcome = 0;

    const allUserBill = await getUserBills(user);

    allUserBill.forEach(async (bill) => {
      let dividedBillPrice = await getUserBillDividedPrice(user.phone, bill.id);

      totalOutcome += dividedBillPrice;
    });

    return totalOutcome;
  } catch (error) {
    console.log(error.message);
  }
};

export const getBill = async (billId) => {
  try {
    const billSnapshot = await db.collection('bills').doc(billId).get();
    if (billSnapshot.exists) return billSnapshot.data();
    else console.log('have no bill');
  } catch (error) {
    console.log(error.message);
  }
};
