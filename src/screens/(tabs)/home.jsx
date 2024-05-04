import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { get_all_bills } from '../../api/constant/services';
import BillCard from '../../components/BillCard';

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const bills = await get_all_bills();
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
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BillCard bill={item}/>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <>
              <View className="flex-row justify-start mb-5">
                <Image
                  source={icons.division}
                  className="w-10 h-10"
                  resizeMode="contain"
                  tintColor="#FF9C01"
                />
                <Text className="text-5xl text-secondary-100 font-bold ml-2">
                  HarnBill
                </Text>
              </View>

              <View className="justify-center items-start mb-5">
                <Text className="font-semibold text-2xl text-white">
                  Welcome! let's หาร bills
                </Text>
                <Text className="font-semibold text-xl text-white">
                  username
                </Text>

                <CustomButton
                  title="Create New Bill"
                  containerStyles="w-full mt-5 items-start"
                  icon={icons.plus_2}
                  handlePress={() =>
                    navigation.navigate('(tabs)', { screen: 'create' })
                  }
                />
              </View>

              <Text className="my-3 text-white text-xl">
                Unpaid Bill
              </Text>
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
