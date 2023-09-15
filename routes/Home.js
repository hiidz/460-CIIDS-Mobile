import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

export const HomeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    // get user data from server here
    setUser(route.params.username);
  }, []);
  return (
    <View style={styles.container}>
      <Text>Enter your {user}</Text>
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
