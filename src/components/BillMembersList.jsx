import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getUserBillDividedPrice } from '../firebase/services';
import icons from '../constants/icons';
import ModalMemberItems from './ModalMemberItems';
import { useGlobalContext } from '../contexts/GlobalContext';

const BillMembersCard = ({ member, billState, onChangeIsPaid, items }) => {
  const { user } = useGlobalContext();
  const [isModalFilterMemberItemVisible, setModalFilterMemberItemVisible] =
    useState(false);

  const [userDividedPrice, setUserDividedPrice] = useState(0);
  const [isFetching, setFetching] = useState(false);

  const get_user_divided_price = async () => {
    try {
      if (!isFetching) setFetching(true);
      const constuserDividedPrice = await getUserBillDividedPrice(
        member.memberPhone,
        billState.id,
      );
      setUserDividedPrice(constuserDividedPrice);
      setFetching(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    get_user_divided_price();
  }, []);

  return (
    <>
      {!isFetching && (
        <TouchableOpacity
          className={`w-1/2 px-3 py-1 mb-2 border-2  ${
            member.isPaid ? 'border-secondary' : 'border-gray-700'
          } rounded-lg mr-2`}
          onPress={() => setModalFilterMemberItemVisible(true)}
        >
          <View className={`flex-row  w-full justify-between  items-center `}>
            <View>
              <View className="mr-2">
                <Text
                  className={`font-medium text-lg ${
                    member.isPaid ? 'text-secondary' : 'text-stroke'
                  }`}
                >
                  {member.membername === user.username
                    ? 'You'
                    : member.membername}{' '}
                  <Text className="font-bold">${userDividedPrice}</Text>
                </Text>
                <Text
                  className={`font-medium text-xs ${
                    member.isPaid ? 'text-secondary' : 'text-stroke'
                  }`}
                >
                  {member.isPaid ? 'Paid' : 'Unpaid'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onChangeIsPaid(member)}
              disabled={member.isPaid}
              className="w-6 h-6"
            >
              {member.isPaid ? (
                <Image
                  source={icons.check_mark}
                  className="w-full h-full"
                  tintColor={`${member.isPaid ? '#ff8e3c' : 'gray'}`}
                />
              ) : (
                <View className="h-full w-full border-2 border-stroke rounded-full" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {isModalFilterMemberItemVisible && (
        <ModalMemberItems
          member={member}
          billState={billState}
          items={items}
          isModalFilterMemberItemVisible={isModalFilterMemberItemVisible}
          setModalFilterMemberItemVisible={setModalFilterMemberItemVisible}
        />
      )}
    </>
  );
};

export default BillMembersCard;
