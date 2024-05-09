import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Logo } from '../../components/Logo';
import { get_user_divided_price } from '../../api/constant/services';
import ItemCard from '../../components/ItemCard';

const Group = ({ route }) => {
  const { user } = useGlobalContext();
  const { bill } = route.params;

  const renderMember = ({ item }) => {
    const user_divided_price = get_user_divided_price(item, bill);
    return (
      <View className="px-3 py-1 mb-2 border-2 border-gray-700 rounded-lg justify-center items-center mr-2">
        <Text className="font-medium text-lg text-secondary">
          {item === user.username ? 'You' : item}{" "}
          <Text className="text-white">${user_divided_price}</Text>
        </Text>
      </View>
    );
  };

  const renderItems = ({ item }) => {
    const divided_price = (item.price / item.divider.length).toFixed(1);
    return (
      <View className="py-2 px-3 border-2 border-gray-700 rounded-lg justify-between items-start mb-2">
        <View className="w-full flex-row justify-between items-center mb-1">
          <Text className="text-lg font-semibold text-white">
            {item.title[0].toUpperCase()}{item.title.slice(1)}
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

  const renderContent = () => (
    <View className="w-full p-5">
      <Text className="font-bold text-xl text-gray-200 my-3">Bill Name</Text>
      <Text className="font-bold text-3xl text-secondary">
        {bill.group_name}
      </Text>
      <Text className="font-bold text-xl text-gray-200 my-3">Divider</Text>
      <View className="w-full">
        <FlatList
          numColumns={2}
          data={bill.members}
          renderItem={renderMember}
          keyExtractor={(item) => item}
          // horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Text className="font-bold text-xl text-gray-200 my-3">Items List</Text>
      <View className="w-full">
        <FlatList
          // numColumns={2}
          data={bill.items}
          renderItem={({item}) => <ItemCard item={item}/>}
          // keyExtractor={(item) => `${item.title}-${item.price}`}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={[1]}
        renderItem={() => renderContent()}
        // keyExtractor={() => 'dummy-key'} // Provide a dummy key
      />
    </SafeAreaView>
  );
};

export default Group;
