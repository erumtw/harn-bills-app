import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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
          <Text className="font-bold">${user_divided_price}</Text>
        </Text>
      </View>
    );
  };

  const renderContent = () => (
    <View className="w-full p-5">
      <TouchableOpacity
        className="justify-center items-start"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-base text-paragraph">Go back</Text>
      </TouchableOpacity>
      <Text className="font-bold text-2xl text-headline my-3">Bill Name</Text>
      <Text className="font-bold text-2xl text-secondary">
        {bill.group_name}
      </Text>
      <Text className="font-bold text-2xl text-headline mt-3">Status</Text>
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
      <Text className="font-bold text-2xl text-headline my-3">Divider</Text>
      <View className="w-full">
        <FlatList
          numColumns={2}
          data={bill.members}
          renderItem={renderMember}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Text className="font-bold text-2xl text-headline mt-3 mb-1">
        Items List
      </Text>
      <View className="w-full">
        <TouchableOpacity
          className="items-center justify-center my-1"
          onPress={() => setItemVisible(!itemVisible)}
        >
          <Text className="text-paragraph font-medium">
            {!itemVisible ? 'show items' : 'hide items'}
          </Text>
        </TouchableOpacity>
        {/* <View className="w-full/2 h-[1px] bg-stroke my-2 rounded-lg" /> */}
        {itemVisible ? (
          <FlatList
            // numColumns={2}
            data={bill.items}
            renderItem={({ item }) => <ItemCard item={item} />}
            // keyExtractor={(item) => `${item.title}-${item.price}`}
          />
        ) : (
          <View>
            <Text className="text-paragraph text-center">
              items is now hiding, click to show
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-[#fef6e4]">
      <FlatList data={[1]} renderItem={() => renderContent()} />
    </SafeAreaView>
  );
};

export default Group;
