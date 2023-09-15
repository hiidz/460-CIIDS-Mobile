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
      <Text>Welcome {user}</Text>
      <Text>1. User can add/register more locks here.</Text>
      <Text>2. Can view and click on individual locks</Text>
      <Text>3. Clicking on lock will navigate lock management screen, where they manage access, view logs, disable lock, arm/disarm locks and view battery life</Text>
      <Text>4. Notification/Alarm activated when buzzer is activated. User has option to turn off buzzer</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
