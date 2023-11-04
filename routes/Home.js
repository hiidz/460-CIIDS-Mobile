import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Dimensions,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import ADIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import axios from "axios";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
const { width } = Dimensions.get("window");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
export const HomeScreen = ({ navigation, route }) => {
  const [lockid, setLockid] = useState();
  const [acl, setAcl] = useState();
  const [isSystemEnabled, setIsSystemEnabled] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      const postData = async () => {
        try {
          const response = await axios.post(
            // `http://192.168.158.242:8080/registerPushToken`,
            `http://192.168.1.66:8080/registerPushToken`,
            {
              lockid: lockid,
              token: token,
            }
          );
          
          setExpoPushToken(token);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      lockid ? postData() : null;
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        disableSiren();
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [lockid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `http://192.168.158.242:8080/lock/${lockid}/acl`
          `http://192.168.1.66:8080/lock/${lockid}/acl`
        );

        setAcl(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchSystemData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.66:8080/lock/${lockid}/systemSecurity`
          // `http://192.168.158.242:8080/lock/${lockid}/systemSecurity`
        );
        setIsSystemEnabled(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    setLockid(route.params.lockid);
    lockid ? fetchData() : null;
    lockid ? fetchSystemData() : null;
  }, [lockid]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <Button
          {...props}
          title="Back"
          onPress={async () => {
            await axios
              .post(
                // `http://192.168.158.242:8080/registerPushToken`,
                `http://192.168.1.66:8080/registerPushToken`,
                {
                  lockid: lockid,
                  token: null,
                }
              )
              .catch((error) => {
                console.error("Error:", error);
              });
            navigation.goBack();
          }}
          // make sure you destructure the navigation variable from the props
          // or otherwise you'll have to write it like this
          // onPress={() => props.navigation.goBack()}
        />
      ),
    });
  }, [navigation, lockid]);

  const addACLUser = () => {
    const patchData = async (obj) => {
      try {
        const response = await axios.patch(
          // `http://192.168.158.242:8080/lock/${lockid}/acl/add`,
          `http://192.168.1.66:8080/lock/${lockid}/acl/add`,
          {
            acl: obj,
          }
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const newACLObj = { name: inputName, group: inputGroup, id: inputID };
    patchData(newACLObj);

    setAcl((prev) => [...prev, newACLObj]);

    setInputName("");
    setInputGroup("");
    setInputID("");

    toggleModalVisibility();
  };

  const delACLUser = (aclName) => {
    const patchData = async (objName) => {
      try {
        console.log(lockid, objName);
        const response = await axios.patch(
          // `http://192.168.158.242:8080/lock/${lockid}/acl/delete/${objName}`
          `http://192.168.1.66:8080/lock/${lockid}/acl/delete/${objName}`
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    patchData(aclName);

    const oldACLState = acl;
    const updatedACLState = oldACLState.filter((obj) => obj.name !== aclName);
    setAcl(updatedACLState);

    console.log("delete");
  };

  const toggleShield = () => {
    const patchData = async () => {
      console.log(isSystemEnabled);
      try {
        const response = await axios.patch(
          // `http://192.168.158.242:8080/lock/${lockid}/systemSecurity`,
          `http://192.168.1.66:8080/lock/${lockid}/systemSecurity`,
          { isSystemEnabled: !isSystemEnabled }
        );

        console.log(response.data);

        if (response) {
          setIsSystemEnabled(response.data.isSystemEnabled);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    patchData();
  };

  const disableSiren = () => {
    const patchData = async (objName) => {
      try {
        const response = await axios.patch(
          // `http://192.168.158.242:8080/lock/${lockid}/siren`
          `http://192.168.1.66:8080/lock/${lockid}/siren`
        );
      } catch (error) {
        console.error("Error:", error);
      }
    };

    patchData(lockid);
    console.log("disabled siren");
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };

  const [inputName, setInputName] = useState("");
  const [inputGroup, setInputGroup] = useState("");
  const [inputID, setInputID] = useState("");

  const onInputChange = (name, value) => {
    if (name === "name") {
      setInputName(value);
    } else if (name === "group") {
      setInputGroup(value);
    } else if (name === "id") {
      setInputID(value);
    }
  };

  function navigateToLogScreen() {
    // navigate somewhere
    // console.log("Hello!");
    navigation.navigate("Logs", { lockid: lockid });
  }

  return (
    <View style={styles.container}>
      <Button title="View Logs" onPress={navigateToLogScreen} />
      <Button title="Disable siren" onPress={disableSiren} />
      {/* <Button
        title="Simulatae notification"
        onPress={schedulePushNotification}
      /> */}
      {/* <Text>Welcome</Text>
      <Text>1. User can add/register more locks here.</Text>
      <Text>2. Can view and click on individual locks</Text>
      <Text>
        3. Clicking on lock will navigate lock management screen, where they
        manage access, view logs, disable lock, arm/disarm locks and view
        battery life
      </Text>
      <Text>
        4. Notification/Alarm activated when buzzer is activated. User has
        option to turn off buzzer
      </Text> */}

      <FlatList
        data={acl}
        renderItem={({ item }) => (
          <Item title={item.name} onClick={delACLUser} />
        )}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={toggleModalVisibility}
      >
        <ADIcon name="adduser" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={
          isSystemEnabled
            ? styles.floatingActionButtonLeftEnabled
            : styles.floatingActionButtonLeftDisabled
        }
        onPress={toggleShield}
      >
        <FeatherIcon name="shield" size={30} color="white" />
        {isSystemEnabled ? (
          <Text style={{ color: "white" }}>Enabled</Text>
        ) : (
          <Text style={{ color: "white" }}>Disabled</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Enter Name..."
            value={inputName}
            style={styles.textInput}
            onChangeText={(value) => onInputChange("name", value)}
          />
          <TextInput
            placeholder="Enter Group..."
            value={inputGroup}
            style={styles.textInput}
            onChangeText={(value) => onInputChange("group", value)}
          />
          <TextInput
            placeholder="Enter ID..."
            value={inputID}
            style={styles.textInput}
            onChangeText={(value) => onInputChange("id", value)}
          />
          <View style={styles.aclForm}>
            <Button title="Close" onPress={toggleModalVisibility} />
            <Button title="Save" onPress={addACLUser} />
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
};

const Item = ({ title, onClick }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity
      // style={styles.floatingActionButton}
      onPress={() => {
        onClick(title);
      }}
    >
      <ADIcon name="delete" size={30} color="black" />
    </TouchableOpacity>
  </View>
);
// ids = [321652097501,785775930251]

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "INTRUDER ALERT",
      body: "CIIDS Door security has been bypassed... Siren has activated, please check on your house. If this is an error, please disable the siren",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
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
  title: {
    fontSize: 32,
  },
  floatingActionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    right: 20,
    height: 70,
    backgroundColor: "blue",
    borderRadius: 100,
  },
  floatingActionButtonLeftEnabled: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    left: 20,
    height: 70,
    backgroundColor: "green",
    borderRadius: 100,
  },
  floatingActionButtonLeftDisabled: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    left: 20,
    height: 70,
    backgroundColor: "red",
    borderRadius: 100,
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 280,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
  aclForm: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
});
