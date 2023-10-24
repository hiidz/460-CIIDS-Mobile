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
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import ADIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import axios from "axios";

const { width } = Dimensions.get("window");

// const ACLData = [
//   { name: "Bobby", group: "Admin", id: 321652097501 },
//   // { name: "Larry", group: "Family", id: 785775930251 },
// ];

export const HomeScreen = ({ navigation, route }) => {
  const [lockid, setLockid] = useState();
  const [acl, setAcl] = useState();
  const [isSystemEnabled, setIsSystemEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.158.242:8080/lock/${lockid}/acl`
        );
        setAcl(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // const fetchSystemData = async () => {
    //   try {
    //     const response = await axios.get(`http://192.168.158.242:8080/lock/${lockid}`);
    //     setIsSystemEnabled(response.data);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };

    setLockid(route.params.lockid);
    lockid ? fetchData() : null;
  }, [lockid]);

  const addACLUser = () => {
    const patchData = async (obj) => {
      try {
        const response = axios.patch(
          `http://192.168.158.242:8080/lock/${lockid}/acl/add`,
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
        const response = axios.patch(
          `http://192.168.158.242:8080/lock/${lockid}/acl/delete/${objName}`
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
    // const patchData = async (objName) => {
    //   try {
    //     const response = axios.patch(`http://192.168.158.242:8080/lock/${lockid}/acl/delete/${objName}`);
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // };

    // patchData(aclName);
    setIsSystemEnabled(!isSystemEnabled);
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
      <Text>Welcome</Text>
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
      </Text>

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
        {isSystemEnabled ? <Text style={{color:"white"}}>Enabled</Text> : <Text style={{color:"white"}}>Disabled</Text>}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
