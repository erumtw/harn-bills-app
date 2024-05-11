import { View, Text, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../contexts/GlobalContext';
import {
  get_user_divided_price,
  set_bill_paid_status,
} from '../../api/constant/services';
import ItemCard from '../../components/ItemCard';
import CustomButton from '../../components/CustomButton';
import { Screen } from 'react-native-screens';

const Group = ({ route, navigation }) => {
  const { user } = useGlobalContext();
  let { bill } = route.params;
  const [itemVisible, setItemVisible] = useState(true);
  const [isPaid, setIsPaid] = useState(bill.is_all_paid);

  const renderMember = ({ item }) => {
    const user_divided_price = get_user_divided_price(item, bill);
    return (
      <View
        className={`px-3 py-1 mb-2 border-2  ${
          item === user.username ? 'border-secondary' : 'border-gray-700'
        } rounded-lg justify-center items-center mr-2`}
      >
        <Text className="font-medium text-lg text-secondary">
          {item === user.username ? 'You' : item}{' '}
          <Text className="text-white">${user_divided_price}</Text>
        </Text>
      </View>
    );
  };

  const renderContent = () => (
    <View className="w-full p-5">
      <Pressable
        className="justify-center items-start"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-base text-gray-300">Go back</Text>
      </Pressable>
      <Text className="font-bold text-xl text-gray-200 my-3">Bill Name</Text>
      <Text className="font-bold text-3xl text-secondary">
        {bill.group_name}
      </Text>
      <Text className="font-bold text-xl text-gray-200 mt-3">Status</Text>
      <View className="flex-row items-center">
        <Text className="font-bold text-xl text-secondary">
          {isPaid ? 'Cleared' : 'Unpaid'}
        </Text>
        <CustomButton
          title="Clear Bill"
          isSubmit={isPaid}
          containerStyles="items-center justify-center ml-2 h-[40px]"
          handlePress={async () => {
            setIsPaid(true);
            const updatedBill = await set_bill_paid_status(bill.id, true);
            bill = updatedBill;
            console.log('updated bill', bill);
          }}
        />
      </View>
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
      <Text className="font-bold text-xl text-gray-200 mt-3 mb-1">
        Items List
      </Text>
      <View className="w-full">
        <Pressable
          className="items-center  justify-center my-1"
          onPress={() => setItemVisible(!itemVisible)}
        >
          <Text className="text-gray-500">
            {!itemVisible ? 'show items' : 'hide items'}
          </Text>
        </Pressable>
        <View className="w-full/2 h-0.5 bg-black-200 my-2 rounded-lg" />
        {itemVisible ? (
          <FlatList
            // numColumns={2}
            data={bill.items}
            renderItem={({ item }) => <ItemCard item={item} />}
            // keyExtractor={(item) => `${item.title}-${item.price}`}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList data={[1]} renderItem={() => renderContent()} />
    </SafeAreaView>
  );
};

export default Group;
