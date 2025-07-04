import { Filter, firestore } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { utils } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId: '',
// });
const db = firebase.firestore();

export const getCurrentUser = async () => {
  try {
    const currentUser = await AsyncStorage.getItem('user');
    console.log('Current User:', currentUser);
    return JSON.parse(currentUser);
  } catch (error) {
    console.log(error);
  }
};

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

export const getUserIdByEmail = async (email) => {
  const userSnapshot = await db
    .collection('users')
    .where('email', '==', email)
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

export const signUp = async (username, phone, email) => {
  try {
    if (phone !== '') {
      const existingUser = await getUserId(phone);
      if (existingUser) {
        Alert.alert('Sign Up Invalid', 'This phone number is already in use.');
        return;
      }
    }

    // Create a new user document
    const newUser = {
      username: username,
      displayname: username,
      phone: phone,
      image: '',
      contacts: [],
      email: email,
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
      itemSnapshot.id = doc.id;
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
    // const paidBills = userBills.filter((bill) =>
    //   bill.members.some(
    //     (member) => member.memberPhone === user.phone && member.isPaid,
    //   ),
    // );

    // Calculate the total amount the user has paid
    for (const bill of userBills) {
      const dividedPrice = await getUserBillDividedPrice(user.phone, bill.id);
      totalOutcome += parseFloat(dividedPrice);
    }

    return totalOutcome.toFixed(1);
  } catch (error) {
    console.error('Error calculating total paid:', error);
  }
};

export const postContactData = async (user, form, contact) => {
  try {
    let imageUrl = form.img;
    if (form.img && !form.img.startsWith('https://')) {
      const storageRef = storage().ref(
        `contactImages/${user.id}/${new Date().getTime()}`,
      );
      await storageRef.putFile(form.img);
      imageUrl = await storageRef.getDownloadURL();
    }

    const newContact = {
      img: imageUrl || '',
      name: form.name,
      phone: form.phone,
    };

    const userDocRef = db.collection('users').doc(user.id);
    let updateData;

    if (!contact) {
      updateData = [...user.contacts, newContact];
    } else {
      const userSnapshot = await userDocRef.get();
      const userData = userSnapshot.data();
      const updateContact = userData.contacts.map((snapshotContact) => {
        if (
          snapshotContact.phone === contact.phone &&
          snapshotContact.name === contact.name
        ) {
          return newContact;
        }
        return snapshotContact;
      });
      updateData = updateContact;
    }

    await userDocRef.update({ contacts: updateData });
    console.log('user updated!');

    const updatedUserSnapshot = await userDocRef.get();
    const userData = updatedUserSnapshot.data();
    userData.id = updatedUserSnapshot.id;

    return userData;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteContact = async (user, contact) => {
  try {
    const userDocRef = db.collection('users').doc(user.id);
    const userData = (await userDocRef.get()).data();

    const updatedContacts = userData.contacts.filter(
      (c) => c.phone !== contact.phone && c.name !== contact.name,
    );

    await userDocRef.update({ contacts: updatedContacts });

    const updatedUserData = await userDocRef.get();
    const updatedUserInfo = {
      ...user,
      contacts: updatedUserData.data().contacts,
    };

    console.log('Contact deleted successfully!');
    return updatedUserInfo;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateProfile = async (user, profileForm) => {
  try {
    let imageUrl = profileForm.image;

    // Check if a new image is uploaded and needs to be stored
    if (profileForm.image && !profileForm.image.startsWith('https://')) {
      const storageRef = storage().ref(
        `profileImages/${user.id}/${user.id}at${new Date().getTime()}`,
      );
      await storageRef.putFile(profileForm.image);
      imageUrl = await storageRef.getDownloadURL();
    }

    // Update user profile in Firestore
    await db.collection('users').doc(user.id).update({
      image: imageUrl,
      username: profileForm.username,
      phone: profileForm.phone,
      displayname: profileForm.displayname,
    });

    // Fetch updated user data
    const userQuery = await db.collection('users').doc(user.id).get();
    const userData = userQuery.data();
    userData.id = user.id;
    console.log('userData', userData);

    return userData;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw new Error('Failed to update profile');
  }
};

export const updatePhoneNumber = async (user, phone) => {
  try {
    // Update user profile in Firestore
    await db.collection('users').doc(user.id).update({
      phone: phone,
    });

    // Fetch updated user data
    const userQuery = await db.collection('users').doc(user.id).get();
    const userData = userQuery.data();
    userData.id = user.id;
    console.log('userData', userData);

    return userData;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw new Error('Failed to update profile');
  }
};