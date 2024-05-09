import { Image, Text, View } from 'react-native';
import icons from '../constants/icons';

export const Logo = () => {
  return (
    <View className="flex-row justify-start my-5">
      <Image
        source={icons.division}
        className="w-10 h-10"
        resizeMode="contain"
        tintColor="#FF9C01"
      />
      <Text className="text-5xl text-secondary-100 font-bold ml-2">
        HarnBills
      </Text>
    </View>
  );
};
