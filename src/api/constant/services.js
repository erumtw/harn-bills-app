// import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../constants/types';
import { groupEndpoint, userEndpoint } from './api_endpoint';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const sign_in = async (username) => {
  try {
    const respone = await fetch(userEndpoint);
    const data = await respone.json();
    const currentUser = data.find((user) => user.username === username);

    if (!currentUser) {
      console.log(username, 'not exist');
      console.log('registering...');

      const newUser = {
        id: '',
        username: username,
        total_paid: 0,
      };

      const postRes = await fetch(userEndpoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      return newUser;
    }

    return currentUser;
  } catch (error) {
    throw new Error(error.message);
  }

  //   console.log(user);
};

export const get_current_user = async () => {
  try {
    const currentUser = await AsyncStorage.getItem('user');
    console.log('Current User:', currentUser);
    return JSON.parse(currentUser);
  } catch (error) {
    console.log(error);
  }
};

export const get_all_bills = async () => {
  return await fetch(groupEndpoint)
    .then((res) => res.json())
    .then((data) => {
      console.log(typeof data);
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const get_user_unpaid_bills = async (username) => {
  try {
    const data = await get_all_bills();
    console.log('data', data);

    const bills = data.filter((group) => {
      const isMember = group.members.some(
        (member) => member.username === username,
      );
      const isUnpaid = !group.is_all_paid;
      return isMember && isUnpaid;
    });

    return bills;
  } catch (error) {
    console.log(error);
  }
};

export const get_user_divided_price = (username, bill) => {
  // see each items that user are divider 
  let sum_price = 0
  console.log(bill);

  bill.items.forEach(item => {
    const divided_price = parseFloat((item.price / item.divider.length).toFixed(1));

    if(item.divider.find(divider => divider === username)) {
      sum_price += divided_price
    }
  });

  return sum_price
};
