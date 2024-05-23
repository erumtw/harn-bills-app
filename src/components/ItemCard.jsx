import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';

const ItemCard = ({ item, bill }) => {
  const { user } = useGlobalContext();
  const divided_price = (item.price / item.divider.length).toFixed(1);

  const getUsername = (dividerPhone) => {
    const memberData = bill.members.filter(
      (member) => member.memberPhone === dividerPhone,
    );
    return memberData[0].membername;
  };

  return (
    <View className="mx-2 py-2 px-3 border-2 border-gray-700 rounded-lg justify-between items-start mb-2">
      <View className="w-full flex-row justify-between items-center mb-1">
        <Text className="text-lg font-semibold text-secondary">
          {item.title[0].toUpperCase()}
          {item.title.slice(1)}
          <Text className="text-gray-500 text-sm">
            {' '}
            ${item.price}/{item.divider.length}
          </Text>
        </Text>
        <Text className="text-secondary text-lg font-bold">
          ${divided_price}/person
        </Text>
      </View>
      <FlatList
        horizontal
        data={item.divider}
        renderItem={({ item }) => {
          const username = getUsername(item);
          return (
            <View
              className={`px-3 py-1 border-2  ${
                item === user.phone ? 'border-secondary' : 'border-gray-700'
              } rounded-lg justify-center items-center mr-2`}
            >
              <Text className="font-medium text-sm text-gray-700">
                {item === user.phone ? 'You' : username}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ItemCard;
