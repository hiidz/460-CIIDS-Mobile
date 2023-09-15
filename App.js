import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const LoginScreen = ({ navigation }) => {
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
      <Button
        onPress={login}
        title="Login"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <StatusBar style="auto" />
    </View>
  );
};

const HomeScreen = ({ navigation, route }) => {
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
