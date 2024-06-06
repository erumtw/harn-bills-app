import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import BillCard from '../../components/BillCard';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Logo } from '../../components/Logo';
import {
  getUserUnpaidBill,
  getBillTotalPrice,
  getUserBillDividedPrice,
} from '../../firebase/services';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const { user, isLogged } = useGlobalContext();

  const [billData, setBillData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const bills = await getUserUnpaidBill(user);
      console.log('unpaid bills of', user.id, ' : ', bills);

      // Fetch additional data for each bill
      const detailedBillData = await Promise.all(
        bills.map(async (bill) => {
          const dividedPrice = await getUserBillDividedPrice(
            user.phone,
            bill.id,
          );
          const totalPrice = await getBillTotalPrice(bill.id);
          return { ...bill, dividedPrice, totalPrice };
        }),
      );

      setBillData(detailedBillData);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isLogged) {
        navigation.replace('(auth)', { screen: 'sign-in' });
      }

      fetchData();
    }, [isLogged]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
      <View className="flex w-full mt-3 px-5">
        {isLoading ? (
          <View className="h-full w-full items-center justify-start">
            <ActivityIndicator style={{ flex: 1 }} />
          </View>
        ) : (
          <FlatList
            data={billData}
            keyExtractor={(item) => item.id}
            renderItem={({ item: bill }) => <BillCard bill={bill} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => (
              <View>
                <Text className="text-paragraph font-semibold">
                  Well done! you have no unpaid bills
                </Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <>
                <Logo />

                <View className="justify-center items-start mb-5">
                  <Text className="font-semibold text-2xl text-headline">
                    Welcome!{' '}
                    <Text className="text-secondary text-3xl">
                      {user?.username}
                    </Text>
                  </Text>
                  <Text className="font-semibold text-xl text-paragraph">
                    let's หาร bills
                  </Text>

                  <CustomButton
                    title="Create New Bill"
                    containerStyles="w-full mt-5 items-start h-[55px]"
                    icon="note-plus"
                    handlePress={() =>
                      navigation.navigate('(tabs)', { screen: 'create' })
                    }
                    itemsStyles="justify-between"
                  />
                </View>

                <View className="w-full h-[1px] bg-headline my-2 rounded-xl opacity-50" />
                <Text className="my-3 text-highlight text-xl font-semibold">
                  Unpaid Bills
                </Text>
              </>
            )}
            ListFooterComponent={() => (
              <View className="items-end">
                <TouchableOpacity
                  onPress={() => navigation.navigate('profile')}
                >
                  <Text className="text-paragraph font-semibold underline">
                    see all bills
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
