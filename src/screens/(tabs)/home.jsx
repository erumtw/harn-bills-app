import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { get_user_unpaid_bills } from '../../api/constant/services';
import BillCard from '../../components/BillCard';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Logo } from '../../components/Logo';

const Home = ({ navigation }) => {
  const { user, isLogged } = useGlobalContext();

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  if (!isLogged) {
    navigation.replace('(auth)', { screen: 'sign-in' });
  }

  const fetchData = async () => {
    try {
      setLoading(true);

      const bills = await get_user_unpaid_bills(user.username);
      console.log('unpaid bills', bills);
      setData(bills);
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

  return (
    <SafeAreaView className="h-full">
      <View className="flex w-full p-5">
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BillCard bill={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => (
              <View>
                <Text className="text-white">
                  Well done! you have no unpaid bills
                </Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <>
                <Logo />

                <View className="justify-center items-start mb-5">
                  <Text className="font-semibold text-2xl text-white">
                    Welcome!{' '}
                    <Text className="text-secondary text-3xl">
                      {user?.username}
                    </Text>
                  </Text>
                  <Text className="font-semibold text-xl text-gray-200">
                    let's หาร bills
                  </Text>

                  <CustomButton
                    title="Create New Bill"
                    containerStyles="w-full mt-5 items-start h-[55px]"
                    icon={icons.plus_2}
                    handlePress={() =>
                      navigation.navigate('(tabs)', { screen: 'create' })
                    }
                    itemsStyles="justify-between"
                  />
                </View>

                <View className="w-full h-0.5 bg-black-200 my-5 rounded-lg" />
                <Text className="my-3 text-white text-xl">Unpaid Bills</Text>
              </>
            )}
            ListFooterComponent={() => (
              <View className="items-end">
                <Pressable onPress={() => navigation.navigate('profile')}>
                  <Text className="text-gray-500">see all bills</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
