import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';

const ItemCard = ({ item }) => {
  const { user } = useGlobalContext();
  const divided_price = (item.price / item.divider.length).toFixed(1);
  
  return (
    <View className="py-2 px-3 border-2 border-gray-700 rounded-lg justify-between items-start mb-2">
      <View className="w-full flex-row justify-between items-center mb-1">
        <Text className="text-lg font-semibold text-white">
          {item.title[0].toUpperCase()}
          {item.title.slice(1)}
        </Text>
        <Text className="text-gray-100 text-sm">
          ${item.price}/{item.divider.length} ={' '}
          <Text className="text-white text-lg">${divided_price}</Text>
        </Text>
      </View>
      <FlatList
        horizontal
        data={item.divider}
        renderItem={({ item }) => (
          <View className="px-3 py-1 border-2 border-black-200 rounded-lg justify-center items-center mr-2">
            <Text className="font-medium text-sm text-secondary">
              {item === user.username ? 'You' : item}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ItemCard;
