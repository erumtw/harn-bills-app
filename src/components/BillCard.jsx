import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Link, useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../contexts/GlobalContext';
import {
  get_total_bill_price,
  get_user_divided_price,
} from '../api/constant/services';

const BillCard = ({ bill }) => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const user_divided_price = get_user_divided_price(user.username, bill);
  const total_bill_price = get_total_bill_price(bill);
  // console.log(bill.id);
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('group', { bill: bill });
      }}
      className="flex-row justify-between items-center w-full p-3 border-2 border-secondary mb-3 rounded-lg"
    >
      <View>
        <Text className="text-lg font-semibold text-secondary-200">
          {bill.group_name[0].toUpperCase()}
          {bill.group_name.slice(1)}
        </Text>
        <Text className="text-sm font-semibold text-gray-500">
          {bill.is_all_paid ? 'Cleared' : 'Unpaid'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-semibold text-gray-200">
          Total:{' '}
          <Text className="text-white text-base">${total_bill_price}</Text>
        </Text>
        <Text className="text-sm font-semibold  text-gray-200">
          You:{' '}
          <Text className="text-white text-base">${user_divided_price}</Text>
        </Text>
      </View>
    </Pressable>
  );
};

export default BillCard;
