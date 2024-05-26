import { View, Text } from 'react-native';
import React from 'react';
import FormField from './FormField';
import icons from '../constants/icons';
import CustomButton from './CustomButton';

const ManualAddForm = ({ form, setForm }) => {
  const onAddMember = () => {
    if (
      !form.members.find((member) => member.membername === form.member_name) &&
      form.member_name !== ''
    ) {
      try {
        const updated_member = form.members;
        updated_member.push({
          membername: form.member_name,
          memberPhone: form.member_phone,
        });

        setForm({
          ...form,
          members: updated_member,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setForm({ ...form, member_name: '', member_phone: '' });
      }
    }
  };

  return (
    <View>
      <FormField
        otherStyles="flex-1"
        placeholder="Enter Member Phone"
        value={form.member_phone}
        handleChange={(e) => setForm({ ...form, member_phone: e })}
      />
      <View className="flex-row w-full items-center my-2">
        <FormField
          otherStyles="flex-1"
          placeholder="Enter Member Name"
          value={form.member_name}
          handleChange={(e) => setForm({ ...form, member_name: e })}
        />
        <CustomButton
          containerStyles="h-[49px] ml-1"
          icon={icons.plus_2}
          handlePress={onAddMember}
        />
        {/* {console.log(form.members)} */}
      </View>
    </View>
  );
};

export default ManualAddForm;
