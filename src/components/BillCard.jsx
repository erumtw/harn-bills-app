import { View, Text, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('group', { bill: bill });
      }}
      className="flex-row justify-between items-center w-full p-3 border-2 border-stroke mb-3 rounded-lg"
    >
      <View>
        <Text className="text-lg font-semibold text-highlight">
          {bill.group_name[0].toUpperCase()}
          {bill.group_name.slice(1)}
        </Text>
        <Text className="text-sm font-semibold text-paragraph">
          {bill.is_all_paid ? 'Cleared' : 'Unpaid'}
        </Text>
      </View>
      <View className="items-end">
      <Text className="text-sm font-semibold  text-highlight">
          You:{' '}
          <Text className="text-base">${user_divided_price}</Text>
        </Text>
        <Text className="text-xs font-semibold text-paragraph">
          Total:{' '}
          <Text className="text-headline text-xs">${total_bill_price}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BillCard;
