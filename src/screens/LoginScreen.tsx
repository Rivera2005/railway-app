import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomAlert from "./CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Second: undefined;
  List: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async () => {
    try {
        const response = await fetch("http://192.168.0.11:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            const accountId = data.accountId.toString();
            await AsyncStorage.setItem("accountId", accountId);

            setAlertMessage(data.message || "Inicio de sesión exitoso");
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                navigation.navigate("Home");
            }, 1000);
        } else {
            setError(data.message || "Credenciales inválidas");
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
        setError("Credenciales Invalidas");
    }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/logostream2.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>FreeStream</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </View>

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onDismiss={() => setShowAlert(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000", // Fondo negro para toda la pantalla
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#0073e6",
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "sans-serif",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#0073e6",
    borderRadius: 5,
    color: "white",
  },
  error: {
    color: "red",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#005bb5",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  registerText: {
    marginTop: 20,
    color: "#0073e6",
  },
  alert: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  }
});
