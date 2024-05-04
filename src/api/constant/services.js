// import {Alert} from 'react-native';
import {User} from '../../constants/types';
import {userEndpoint} from './api_endpoint';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const sign_in = async (username) => {
  try {
    const respone = await fetch(userEndpoint);
    const data = await respone.json();
    // const user = data.find((user: User) => user.username === username);

    // if (!user) {
    //   console.log(username, 'not exist');
    //   console.log('registering...');

    //   const newUser: User = {
    //     id: '',
    //     username: username,
    //     total_paid: 0
    //   };

    //   const postRes = await fetch(userEndpoint, {
    //     method: 'post',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(newUser),
    //   });
    // }

    // return user;
  } catch (error) {
    throw new Error(error.message);
  }

  //   console.log(user);
};
