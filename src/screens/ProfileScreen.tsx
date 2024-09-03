import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    email: "",
    username: "",
  });
  const [errors, setErrors] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    email: "",
    username: "",
  });

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accountIdString = await AsyncStorage.getItem("accountId");
        const accountId = accountIdString ? parseInt(accountIdString, 10) : null;

        if (accountId !== null) {
          const response = await axios.get(`http://192.168.0.11:5000/user/${accountId}`);
          setUser(response.data);
          // Excluir el campo 'id' al establecer formData
          const { id, ...userData } = response.data;
          setFormData(userData);
        } else {
          console.error("Account ID not found in storage");
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors: any = {};

    // Validaciones para campos de texto
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(formData.primer_nombre)) {
      newErrors.primer_nombre = 'Primer Nombre, Acepta letras, tildes y espacios.';
      isValid = false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(formData.segundo_nombre)) {
      newErrors.segundo_nombre = 'Segundo Nombre, Acepta letras, tildes y espacios.';
      isValid = false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(formData.primer_apellido)) {
      newErrors.primer_apellido = 'Primer Apellido, Acepta letras, tildes y espacios.';
      isValid = false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(formData.segundo_apellido)) {
      newErrors.segundo_apellido = 'Segundo Apellido, Acepta letras, tildes y espacios.';
      isValid = false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(formData.username)) {
      newErrors.username = 'Nombre de Usuario, Acepta letras, tildes y espacios.';
      isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Debe ser un correo electrónico válido.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateFields()) {
      try {
        setLoading(true);
        const accountIdString = await AsyncStorage.getItem("accountId");
        const accountId = accountIdString ? parseInt(accountIdString, 10) : null;

        if (accountId !== null) {
          await axios.put(`http://192.168.0.11:5000/user/${accountId}`, formData);
          setUser(formData); // Update user data locally
          setIsEditing(false);
        } else {
          console.error("Account ID not found in storage");
        }
      } catch (error) {
        console.error("Error updating user:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005bb5" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isEditing && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Perfil</Text>
      {isEditing ? (
        <>
          {Object.keys(formData).map((key) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{key.replace('_', ' ').toUpperCase()}:</Text>
              <TextInput
                style={styles.input}
                value={formData[key]}
                onChangeText={(text) => handleChange(key, text)}
              />
              <Text style={styles.infoText}>Acepta letras, tildes y espacios.</Text>
              {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
            </View>
          ))}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {Object.keys(user).map((key) => (
            key !== "id" && (
              <View key={key} style={styles.infoGroup}>
                <Text style={styles.label}>{key.replace('_', ' ').toUpperCase()}:</Text>
                <Text style={styles.value}>{user[key]}</Text>
              </View>
            )
          ))}
          <Button title="Editar" onPress={() => setIsEditing(true)} color="#005bb5" />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    padding: 35,
    paddingTop: 70,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 40,
    fontWeight: "bold",
  },
  label: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
    width: "100%",
  },
  infoGroup: {
    marginBottom: 20,
    width: "100%",
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#005bb5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  saveButton: {
    backgroundColor: "#005bb5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
});

export default ProfileScreen;
