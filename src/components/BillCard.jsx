import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../contexts/GlobalContext';
import {
  get_total_bill_price,
  get_user_divided_price,
} from '../api/constant/services';
import { getBillTotalPrice, getUserDividedPrice } from '../firebase/services';

const BillCard = ({ bill }) => {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const [dividedPrice, setDividedPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    try {
      // console.log('fetching price of billId:', bill.id);
      const divided_price = await getUserDividedPrice(user.phone, bill.id);
      const total_bill_price = await getBillTotalPrice(bill.id);

      setDividedPrice(divided_price);
      setTotalPrice(total_bill_price);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('group', { bill: bill });
      }}
      className="flex-row justify-between items-center w-full p-3 border-2 border-stroke mb-3 rounded-lg"
    >
      <View>
        <Text className="text-lg font-semibold text-highlight">
          {bill.bill_name[0].toUpperCase()}
          {bill.bill_name.slice(1)}
        </Text>
        <Text className="text-sm font-semibold text-paragraph">
          {bill.status ? 'Cleared' : 'Unpaid'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-semibold  text-highlight">
          You: <Text className="text-base">${dividedPrice}</Text>
        </Text>
        <Text className="text-xs font-semibold text-paragraph">
          Total: <Text className="text-headline text-xs">${totalPrice}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BillCard;
