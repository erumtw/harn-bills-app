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

      const data = await postRes.json()
      return data
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
      const isMember = group.members.some((member) => member === username);
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
  let sum_price = 0;
  console.log(bill);

  bill.items.forEach((item) => {
    const divided_price = parseFloat(item.price / item.divider.length);

    if (item.divider.find((divider) => divider === username)) {
      sum_price += divided_price;
    }
  });

  return parseFloat(sum_price).toFixed(1);
};

export const get_user_all_bills = async (username) => {
  try {
    const data = await get_all_bills();

    const userBills = data.filter((group) => group.members.includes(username));
    console.log('userbills2: ', userBills);
    return userBills;
  } catch (error) {
    console.log(error);
  }
};

export const get_user_total_paid = async (username) => {
  try {
    let total_paid = 0;
    const user_bills = await get_user_all_bills(username);

    user_bills.forEach((bill) => {
      const divided_price = get_user_divided_price(username, bill);
      total_paid += parseFloat(divided_price);
    });

    return parseFloat(total_paid).toFixed(1);
  } catch (error) {
    console.log(error);
  }
};

export const get_total_bill_price = (bill) => {
  try {
    let total_price = 0;

    bill.items.forEach((item) => {
      total_price += parseFloat(item.price);
    });

    return parseFloat(total_price).toFixed(1);
  } catch (error) {
    console.log(error);
  }
};

export const post_bill = async ({
  is_all_paid,
  group_name,
  members,
  items,
}) => {
  try {
    const bill = {
      id: '',
      is_all_paid: is_all_paid,
      group_name: group_name,
      members: members,
      items: items,
    };

    const res = await fetch(groupEndpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bill),
    });

    const newBill = await res.json();
    return newBill;
  } catch (error) {
    console.log(error);
  }
};

export const set_bill_paid_status = async (billId, isPaid) => {
  try {

    const response = await fetch(`${groupEndpoint}/${billId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_all_paid: isPaid }),
    });

    if (!response.ok) {
      throw new Error('Failed to update bill paid status');
    }

    const updatedBill = await response.json();
    return updatedBill;
  } catch (error) {
    console.log(error);
  }
};
