import { StyleSheet, TextInput, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

export const LogScreen = ({ route }) => {
  const [lockid, setLockid] = useState();
  const [logs, setLogs] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.158.242:8080/lock/${lockid}/logs`
        );
        setLogs(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    setLockid(route.params.lockid);
    lockid ? fetchData() : null;
  }, [lockid]);

  return (
    <View style={styles.container}>
      <Text>{lockid}{logs}</Text>
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
