import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { get_user_unpaid_bills } from '../../api/constant/services';
import BillCard from '../../components/BillCard';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Logo } from '../../components/Logo';
import firestore from '@react-native-firebase/firestore';
import { getUserId, getUserUnpaidBill } from '../../firebase/services';

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

      // const userIdawait getUserId(user.phone));
      const bills = await getUserUnpaidBill(user.id);

      // console.log('unpaid bills', bills);
      if(!bills) {
        return;
      }
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
                    icon={icons.plus_2}
                    handlePress={() =>
                      navigation.navigate('(tabs)', { screen: 'create' })
                    }
                    itemsStyles="justify-between"
                  />
                </View>

                <View className="w-full h-[1px] bg-stroke my-5 rounded-lg" />
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
                  <Text className="text-paragraph font-semibold">
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
