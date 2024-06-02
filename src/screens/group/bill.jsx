import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../contexts/GlobalContext';
import ItemCard from '../../components/ItemCard';
import {
  checkAndUpdateBillStatus,
  getBillItems,
  updateMemberPaidStatus,
} from '../../firebase/services';
import BillMembersCard from '../../components/BillMembersList';
import BillReceipt from '../../components/BillReceipt';

const Bill = ({ route, navigation }) => {
  const { user } = useGlobalContext();
  let { bill } = route.params;
  const [itemVisible, setItemVisible] = useState(true);
  const [isPaid, setIsPaid] = useState(bill.status);
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [billState, setBill] = useState(bill);
  const [isModalExportVisible, setModalExportVisible] = useState();

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
      bill = billState;
      console.log('updatedBill: ', updatedBill);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onExport = () => setModalExportVisible(true);

  const renderContent = () => {
    return (
      <View className="w-full p-5">
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="justify-center items-start"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-base text-paragraph">Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="justify-center items-start"
            onPress={onExport}
          >
            <Text className="text-base text-paragraph">Export</Text>
          </TouchableOpacity>
        </View>
        <Text className="font-bold text-2xl text-headline my-3">Bill Name</Text>
        <Text className="font-bold text-2xl text-secondary">
          {billState.bill_name}
        </Text>
        <Text className="font-bold text-2xl text-headline mt-3">Status</Text>
        <View className="flex-row items-center">
          <Text className="font-bold text-xl text-secondary">
            {isPaid ? 'Cleared' : 'Unclear'}
          </Text>
        </View>
        <Text className="font-bold text-2xl text-headline my-3">Members</Text>
        <View className="w-full">
          {console.log(billState.members)}
          <FlatList
            numColumns={2}
            data={billState.members}
            renderItem={({ item: member }) => (
              <BillMembersCard
                member={member}
                billState={billState}
                onChangeIsPaid={onChangeIsPaid}
                items={items}
              />
            )}
          />
        </View>
        <Text className="font-bold text-2xl text-headline mt-3 mb-1">
          Items List
        </Text>
        <View className="w-full">
          {/* <View className="w-full/2 h-[1px] bg-stroke my-2 rounded-lg" /> */}
          {itemVisible ? (
            <FlatList
              // numColumns={2}
              data={items}
              renderItem={({ item }) => (
                <ItemCard item={item} bill={billState} />
              )}
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
        <View className="h-full">
          <View className="h-full w-full items-center justify-start">
            <ActivityIndicator style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <>
          <FlatList data={[1]} renderItem={() => renderContent()} />
          {isModalExportVisible && (
            <BillReceipt
              bill={billState}
              items={items}
              members={billState.members}
              isModalExportVisible={isModalExportVisible}
              setModalExportVisible={setModalExportVisible}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Bill;
