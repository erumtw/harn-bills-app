import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import ProfileInfo from '../../components/ProfileInfo';
import BillCard from '../../components/BillCard';
import {
  get_user_all_bills,
  get_user_total_paid,
} from '../../api/constant/services';
import CustomButton from '../../components/CustomButton';

const Profile = ({ navigation }) => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const bills = await get_user_all_bills(user.username);
      // console.log('user bills', bills);

      const total_price = await get_user_total_paid(user.username);

      setData(bills);
      setTotalPrice(total_price);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // console.log('user bills ', data);

  const sign_out = async () => {
    await AsyncStorage.removeItem('user');
    // console.log(user);
    setIsLogged(false);
    setUser(null);
    navigation.replace('(auth)', { screen: 'sign-in' });
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 20 }}
          data={data}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View className="w-full justify-center items-center">
              <Text className="text-white">Well done! you have no bills</Text>
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
                tintColor="#FF9C01"
              />

              <View className="flex-row justify-center items-center mt-3">
                <Text className="text-2xl font-semibold text-secondary mr-2">
                  {user.username[0].toUpperCase()}
                  {user.username.slice(1)}
                </Text>
                <Pressable
                  className="justify-center items-center"
                  onPress={sign_out}
                >
                  <Image
                    source={icons.log_out}
                    className="w-8 h-8"
                    tintColor="#FF9C01"
                  />
                </Pressable>
              </View>

              <View className="flex-row ustify-between mt-3">
                <ProfileInfo
                  title="Bill Count"
                  subtitle={data.length}
                  otherStyles="mr-5"
                />
                <ProfileInfo title="Total Paid" subtitle={`$${totalPrice}`} />
              </View>

              <View className="w-full h-0.5 bg-black-200 my-5 rounded-lg" />
              <Text className="text-lg text-gray-300">Bills History</Text>
            </View>
          )}
          renderItem={({ item }) => <BillCard bill={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
