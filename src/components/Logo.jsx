import { Image, Text, View } from 'react-native';
import icons from '../constants/icons';

export const Logo = ({ blackwhite }) => {
  return (
    <View className="justify-start items-start my-5">
      <Image
        source={blackwhite === true ? icons.BlackLogo : icons.billDivvy}
        className="w-32 h-32 rounded-lg"
        resizeMode="contain"
        // tintColor={`${blackwhite ? 'black' : '#ff8e3c'}`}
      />
      {/* <Text
        className={`text-3xl ${
          blackwhite ? 'text-black' : 'text-secondary'
        } font-bold ml-2 mt-3`}
      >
        easy bill split
      </Text> */}
    </View>
  );
};
