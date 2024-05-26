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

export const getBill = async (billId) => {
  try {
    const billSnapshot = await db.collection('bills').doc(billId).get();
    if (billSnapshot.exists) return billSnapshot.data();
    else console.log('have no bill');
  } catch (error) {
    console.log(error.message);
  }
};

export const postBill = async (form) => {
  try {
    let newBillData = null;
    // Step 1: Start a Firestore transaction
    await db.runTransaction(async (transaction) => {
      // Step 2: Add bill details to the bills collection
      const billRef = db.collection('bills').doc();
      const billData = {
        bill_name: form.bill_name,
        date_Create: formatDate(new Date()),
        members: form.members.map((member) => ({
          membername: member.membername,
          memberPhone: member.memberPhone,
          isPaid: false,
        })),
        status: false,
      };

      transaction.set(billRef, billData);

      // Step 3: Retrieve the bill ID
      const billId = billRef.id;

      // Step 4: Add each item to the items collection
      form.items.forEach((item) => {
        const itemRef = db.collection('items').doc();
        const itemDivider = item.divider.map((divider) => divider.memberPhone);
        const itemData = {
          bill_id: billId,
          divider: itemDivider,
          price: parseFloat(item.price),
          title: item.title,
        };

        transaction.set(itemRef, itemData);
      });

      newBillData = { id: billId, ...billData };
    });

    console.log('Bill created successfully');
    // Alert.alert('Success', 'Bill created successfully');
    return newBillData;
  } catch (error) {
    console.error('Error creating bill:', error);
    // Alert.alert('Error', 'Failed to create bill. Please try again.');
  }
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const updateBillStatus = async (billId, newStatus) => {
  try {
    const billRef = await db
      .collection('bills')
      .doc(billId)
      .update({ status: newStatus })
      .then(() => console.log('bill updated!'));

    const billData = await billRef.get().data();
    billData.id = billRef.id;

    return billData;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateMemberPaidStatus = async (
  billId,
  memberPhone,
  newStatus,
) => {
  try {
    // Retrieve the bill document
    const billRef = db.collection('bills').doc(billId);
    const billSnapshot = await billRef.get();
    const billData = billSnapshot.data();

    // Update the isPaid status of the specific member
    const updatedMembers = billData.members.map((member) => {
      if (member.memberPhone === memberPhone) {
        return { ...member, isPaid: newStatus };
      }
      return member;
    });

    // Update the bill document with the updated members array
    await billRef.update({ members: updatedMembers });
    console.log('Member status updated!');

    // Retrieve the updated bill data
    const updatedBillSnapshot = await billRef.get();
    const updatedBillData = updatedBillSnapshot.data();
    updatedBillData.id = billRef.id;

    return updatedBillData;
  } catch (error) {
    console.error('Error updating member status:', error.message);
    throw error; // Rethrow the error so the caller can handle it if needed
  }
};

export const checkAndUpdateBillStatus = async (billId) => {
  try {
    const billRef = db.collection('bills').doc(billId);
    const billSnapshot = await billRef.get();

    if (!billSnapshot.exists) {
      throw new Error('Bill not found');
    }

    const billData = billSnapshot.data();

    const allPaid = billData.members.every((member) => member.isPaid);

    if (allPaid) {
      await billRef.update({ status: true });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating bill status:', error);
  }
};

export const getUserTotalOutcome = async (user) => {
  try {
    let totalOutcome = 0;

    // Retrieve all bills related to the user
    const userBills = await getUserBills(user);

    // Filter out the bills where the user has paid
    const paidBills = userBills.filter((bill) =>
      bill.members.some(
        (member) => member.memberPhone === user.phone && member.isPaid,
      ),
    );

    // Calculate the total amount the user has paid
    for (const bill of paidBills) {
      const dividedPrice = await getUserBillDividedPrice(user.phone, bill.id);
      totalOutcome += parseFloat(dividedPrice);
    }

    return totalOutcome.toFixed(2);
  } catch (error) {
    console.error('Error calculating total paid:', error);
  }
};
