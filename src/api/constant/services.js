// import {Alert} from 'react-native';
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

export const get_all_bills = async () => {
  return await fetch(groupEndpoint)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error.message);
    });
};
