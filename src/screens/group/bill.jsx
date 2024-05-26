import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../contexts/GlobalContext';
import ItemCard from '../../components/ItemCard';
import CustomButton from '../../components/CustomButton';
import { Screen } from 'react-native-screens';
import {
  checkAndUpdateBillStatus,
  getBillItems,
  getUserBillDividedPrice,
  updateBillStatus,
  updateMemberPaidStatus,
} from '../../firebase/services';
import icons from '../../constants/icons';

const Bill = ({ route, navigation }) => {
  const { user } = useGlobalContext();
  let { bill } = route.params;
  const [itemVisible, setItemVisible] = useState(false);
  const [isPaid, setIsPaid] = useState(bill.status);
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [billState, setBill] = useState(bill);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const items = await getBillItems(billState.id);
        setItems(items);
        console.log('items: ', items);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
      // return items;
    };

    fetchData();
  }, []);

  const onChangeIsPaid = async (member) => {
    try {
      setLoading(true);
      const updatedBill = await updateMemberPaidStatus(
        billState.id,
        member.memberPhone,
        true,
      );
      // console.log(updatedBill);

      const isBillClear = await checkAndUpdateBillStatus(billState.id);
      if (isBillClear) {
        setIsPaid(true);
        updatedBill.status = true;
      }

      setBill(updatedBill);
      bill = billState
      console.log('updatedBill: ', updatedBill);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMember = async ({ item: member }) => {
    const user_divided_price = await getUserBillDividedPrice(
      member.memberPhone,
      billState.id,
    );

    return (
      <View
        className={`flex-row w-1/2 px-3 py-1 mb-2 border-2  ${
          member.membername === user.username
            ? 'border-secondary'
            : 'border-gray-700'
        } rounded-lg justify-between  items-center mr-2`}
      >
        <View>
          <View className="mr-2">
            <Text className="font-medium text-lg text-secondary">
              {member.membername === user.username ? 'You' : member.membername}{' '}
              <Text className="font-bold">${user_divided_price}</Text>
            </Text>
            <Text className="font-medium text-xs text-secondary">
              {member.isPaid ? 'Paid' : 'Unpaid'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onChangeIsPaid(member)}
          disabled={member.isPaid}
        >
          <Image
            source={icons.check_mark}
            className="w-6 h-6"
            tintColor={`${member.isPaid ? '#ff8e3c' : 'gray'}`}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View className="w-full p-5">
        <TouchableOpacity
          className="justify-center items-start"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-base text-paragraph">Go back</Text>
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-headline my-3">Bill Name</Text>
        <Text className="font-bold text-2xl text-secondary">
          {billState.bill_name}
        </Text>
        <Text className="font-bold text-2xl text-headline mt-3">Status</Text>
        <View className="flex-row items-center">
          <Text className="font-bold text-xl text-secondary">
            {isPaid ? 'Cleared' : 'Unclear'}
          </Text>
          {/* <CustomButton
            title="Clear Bill"
            isSubmit={isPaid}
            containerStyles="items-center justify-center ml-2 h-[40px]"
            handlePress={async () => {
              const updatedBill = await updateBillStatus(bill.id, true);
              setIsPaid(true);
              bill = updatedBill;
              console.log('updated bill', bill);
            }}
          /> */}
        </View>
        <Text className="font-bold text-2xl text-headline my-3">Divider</Text>
        <View className="w-full">
          {console.log(billState.members)}
          <FlatList
            numColumns={2}
            data={billState.members}
            renderItem={renderMember}
            // keyExtractor={(item) => item}
            // showsHorizontalScrollIndicator={false}
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
            <Text className="text-paragraph font-medium underline">
              {!itemVisible ? 'show items' : 'hide items'}
            </Text>
          </TouchableOpacity>
          {/* <View className="w-full/2 h-[1px] bg-stroke my-2 rounded-lg" /> */}
          {itemVisible ? (
            <FlatList
              // numColumns={2}
              data={items}
              renderItem={({ item }) => (
                <ItemCard item={item} bill={billState} />
              )}
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
  };

  return (
    <SafeAreaView className="h-full bg-[#fef6e4]">
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <FlatList data={[1]} renderItem={() => renderContent()} />
      )}
    </SafeAreaView>
  );
};

export default Bill;
