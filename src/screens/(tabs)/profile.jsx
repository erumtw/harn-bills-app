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
import ModalEditProfile from '../../components/ModalEditProfile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Profile = ({ navigation }) => {
  const { user, setUser, isLogged, setIsLogged } = useGlobalContext();
  const [data, setData] = useState([]);
  const [DividedPriceBillData, setDividedPriceBillData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalEditProfileVisible, setModalEditProfileVisible] =
    useState(false);

  const fetchData = async () => {
    try {
      if (!isLoading) {
        setLoading(true);
      }

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
      // console.log("user", user);
      // console.log("total_outcome", total_outcome);
      setData(bills);
      setDividedPriceBillData(detailedBillData);
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
        <View className="h-full">
          <View className="h-full w-full items-center justify-start">
            <ActivityIndicator style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <>
          <FlatList
            maxToRenderPerBatch={8}
            contentContainerStyle={{ padding: 20 }}
            data={DividedPriceBillData}
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
                  handlePress={() =>
                    navigation.replace('(tabs)', { screen: 'create' })
                  }
                />
              </View>
            )}
            ListHeaderComponent={() => (
              <View className="w-full justify-center items-center my-5">
                <TouchableOpacity
                  onPress={() => setModalEditProfileVisible(true)}
                  className="flex-row items-center justify-center my-2"
                >
                  <Text className="text-sm text-stroke">Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalEditProfileVisible(true)}
                >
                  <Image
                    source={
                      user.image === '' ? icons.profile : { uri: user.image }
                    }
                    className="w-24 h-24 rounded-full"
                    tintColor={user.image === '' ? '#ff8e3c' : null}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View className="flex-row justify-center items-center mt-3">
                  <Text className="text-2xl font-bold text-headline mr-2">
                    {user.username[0].toUpperCase()}
                    {user.username.slice(1)}
                  </Text>
                  <TouchableOpacity
                    className="justify-center items-center"
                    onPress={sign_out}
                  >
                    {/* <Image
                      source={icons.log_out}
                      className="w-8 h-8"
                      tintColor="#ff8e3c"
                    /> */}
                    <MaterialCommunityIcons name="logout" color="#ff8e3c" size={30}/>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between mt-3">
                  <ProfileInfo
                    title="Bill Count"
                    subtitle={data.length}
                    otherStyles="mr-5"
                  />
                  <ProfileInfo
                    title="Total Price"
                    subtitle={`$${totalOutcome}`}
                  />
                </View>
                <View className="w-full h-[1px] bg-headline my-5 rounded-lg" />
                <Text className="text-lg text-headline font-semibold">
                  Bills History
                </Text>
              </View>
            )}
            renderItem={({ item }) => <BillCard bill={item} />}
          />

          {isModalEditProfileVisible && (
            <ModalEditProfile
              isModalEditProfileVisible={isModalEditProfileVisible}
              setModalEditProfileVisible={setModalEditProfileVisible}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Profile;
