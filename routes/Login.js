import { StyleSheet, TextInput, Text, View, Button } from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  function login() {
    // navigate somewhere
    // console.log("Hello!");
    navigation.navigate("Home", { username: username });
  }
  return (
    <View style={styles.container}>
      <Text>Enter your username {username}</Text>
      <TextInput
        style={{ height: 40, margin: 12, borderWidth: 1, padding: 10 }}
        onChangeText={setUsername}
        value={username}
        placeholder="Enter username"
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
