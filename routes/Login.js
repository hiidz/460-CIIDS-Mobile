import { StyleSheet, TextInput, Text, View, Button } from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export const LoginScreen = ({ navigation }) => {
  const [lockid, setLockid] = useState("");
  function login() {
    // navigate somewhere
    // console.log("Hello!");
    navigation.navigate("Home", { lockid: lockid });
  }
  return (
    <View style={styles.container}>
      <Text>Enter your Lock Id {lockid}</Text>
      <TextInput
        style={{ height: 40, margin: 12, borderWidth: 1, padding: 10 }}
        onChangeText={setLockid}
        value={lockid}
        placeholder="Enter lock id"
      />
      <Button onPress={login} title="Login" color="#841584" />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
