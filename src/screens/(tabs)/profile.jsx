import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import ProfileInfo from '../../components/ProfileInfo';
import BillCard from '../../components/BillCard';
import CustomButton from '../../components/CustomButton';
import {
  getUserBills,
  getUserTotalOutcome,
  getBillTotalPrice,
  getUserBillDividedPrice,
} from '../../firebase/services';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const { user, setUser, isLogged, setIsLogged } = useGlobalContext();
  const [data, setData] = useState([]);
  const [billData, setBillData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const bills = await getUserBills(user);
      const total_outcome = await getUserTotalOutcome(user);

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

      setData(bills);
      setBillData(detailedBillData);
      setTotalOutcome(total_outcome);
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

  const sign_out = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('user');
      setIsLogged(false);
      navigation.replace('(auth)', { screen: 'sign-in' });
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          size="large"
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 20 }}
          data={billData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View className="w-full justify-center items-center">
              <Text className="text-headline">
                Well done! you have no bills
              </Text>
              <CustomButton
                title="Let's Create Bill!"
                itemsStyles="items-center"
                containerStyles="h-[40px] my-3"
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center my-5">
              <Image
                source={icons.profile}
                className="w-16 h-16"
                tintColor="#ff8e3c"
              />
              <View className="flex-row justify-center items-center mt-3">
                <Text className="text-2xl font-bold text-headline mr-2">
                  {user.username[0].toUpperCase()}
                  {user.username.slice(1)}
                </Text>
                <TouchableOpacity
                  className="justify-center items-center"
                  onPress={sign_out}
                >
                  <Image
                    source={icons.log_out}
                    className="w-8 h-8"
                    tintColor="#ff8e3c"
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between mt-3">
                <ProfileInfo
                  title="Bill Count"
                  subtitle={data.length}
                  otherStyles="mr-5"
                />
                <ProfileInfo title="Total Paid" subtitle={`$${totalOutcome}`} />
              </View>
              <View className="w-full h-[1px] bg-headline my-5 rounded-lg" />
              <Text className="text-lg text-headline font-semibold">
                Bills History
              </Text>
            </View>
          )}
          renderItem={({ item }) => <BillCard bill={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
