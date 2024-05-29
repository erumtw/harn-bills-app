import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const BillCard = ({ bill }) => {
  const navigation = useNavigation();

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
        <Text
          className={`text-sm ${
            bill.status ? 'text-green-800 font-semibold' : 'text-gray-700 font-bold'
          }`}
        >
          {bill.status ? 'Cleared' : 'Unclear'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-semibold text-highlight">
          You: <Text className="text-base">${bill.dividedPrice}</Text>
        </Text>
        <Text className="text-xs font-semibold text-paragraph">
          Total: <Text className="text-headline text-xs">${bill.totalPrice}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BillCard;
