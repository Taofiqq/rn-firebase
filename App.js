import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
} from "react-native";
import { app } from "./firebase/firebase";
import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [data, setData] = useState([]);
  const db = getFirestore(app);

  const addTodo = async () => {
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        title,
        completed,
      });
      setTitle("");
      getAllTodos();
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTodos = async () => {
    try {
      const docRef = await getDocs(collection(db, "todos"));
      setData(docRef);
      let arr = [];
      docRef.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
        setData(arr);
        console.log(arr);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working </Text>
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter a todo"
        style={styles.input}
      />
      <Button title="Add Todo" onPress={addTodo} />
      <View style={styles.data}>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.title}</Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
  },
});

