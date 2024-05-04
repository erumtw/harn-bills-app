// import { View, Text, ScrollView, TextInput, Alert } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import FormField from "../../components/FormField";
// import { Feather } from "@expo/vector-icons";
// import CustomButton from "../../components/CustomButton";
// import { userEndpoint } from "../../constants/api.js";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useGlobalContext } from "../../context/GlobalProvider.js";

// const SignIn = () => {
//   // const { isLoggedIn } = useGlobalContext();
//   const [submit, setSubmit] = useState(false);
//   const [form, setForm] = useState({
//     username: "",
//   });
//   // console.log(isLoggedIn);
//   // if (isLoggedIn) {
//   //   router.replace("/home");
//   // }
//   // console.log(userEndpoint);
//   const signIn = async (form) => {
//     const respone = await fetch(userEndpoint);
//     const data = await respone.json();

//     const user = data.find((user) => user.username === form.username);
//     console.log(user);

//     if (user) {
//       console.log("click", user);
//       Alert.alert("Successfully Login");
//     } else {
//       console.log(form.username, "not exist");
//       console.log("registering...");
//       const postRes = await fetch(userEndpoint, {
//         method: "post",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: form.username,
//           total_paid: 0,
//         }),
//       });
//       Alert.alert("Successfully register");
//     }

//     await AsyncStorage.setItem("user", JSON.stringify(user));

//     // console.log(JSON.parse(await AsyncStorage.getItem("user")));
//   };

//   const onSubmit = async () => {
//     if (form.username === "") {
//       return Alert.alert("Invalid Form", "Please fill all fields");
//     }

//     setSubmit(true);

//     try {
//       // check authentication if right navigate to home else throw error
//       await signIn(form);

//       router.replace("/home");
//     } catch (error) {
//       Alert.alert("Invalid Sign In", error.message);
//     } finally {
//       setSubmit(false);
//     }
//   };

//   return (
//     <SafeAreaView className="bg-primary h-full">
//       <ScrollView>
//         <View className="justify-center px-5">
//           <View className="w-full mt-32">
//             <View className="flex-row justify-start mb-5">
//               <Feather
//                 name="divide"
//                 color="#FF9C01"
//                 size={28}
//                 className="mr-1"
//               />
//               <Text className="text-3xl font-psemibold text-secondary ml-1">
//                 HarnBill
//               </Text>
//             </View>
//             <Text className="text-white text-2xl font-pregular">Sign In</Text>
//           </View>

//           <FormField
//             title="username"
//             handleChange={(e) => setForm({ ...form, username: e })}
//             value={form.username}
//             otherStyles="mt-5"
//           />
//           {/* {console.log(form.username)} */}
//           <CustomButton
//             title="Sign In"
//             containerStyles="mt-8"
//             handlePress={onSubmit}
//           />

//           {/* <Text className="font-pregular text-gray-100 text-lg text-center mt-5">
//           Do not have an account?{" "}
//           <Link href="/sign-up" className="text-secondary font-semibold">
//             Sign Up
//           </Link>
//         </Text> */}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SignIn;
