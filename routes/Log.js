import { StyleSheet, FlatList, Text, View } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

export const LogScreen = ({ route }) => {
  const [lockid, setLockid] = useState();
  const [logs, setLogs] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `http://192.168.158.242:8080/logs/${lockid}`
          `http://192.168.1.66:8080/logs/${lockid}`
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
      {/* <Text>
        {lockid}
        {logs ? logs.map((obj) => <Text>{obj}</Text>) : null}
      </Text> */}
      {/* <Item title={logs} /> */}
      <FlatList
        data={logs}
        renderItem={({ item }) => <Item title={item.message} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
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
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
