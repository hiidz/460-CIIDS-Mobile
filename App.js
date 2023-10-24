import { HomeScreen } from "./routes/Home";
import { LoginScreen } from "./routes/Login";
import { LogScreen } from "./routes/Log";
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
        <Stack.Screen
          name="Logs"
          component={LogScreen}
          options={{ title: "Logs" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
