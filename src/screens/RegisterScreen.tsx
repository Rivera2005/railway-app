import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomAlert from './CustomAlert'; // Asegúrate de que la ruta sea correcta

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Second: undefined;
  List: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [primer_nombre, setPrimerNombre] = useState('');
  const [segundo_nombre, setSegundoNombre] = useState('');
  const [primer_apellido, setPrimerApellido] = useState('');
  const [segundo_apellido, setSegundoApellido] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const validateFields = () => {
    let isValid = true;
    let errorMessage = '';

    // Validaciones para campos de texto
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(primer_nombre)) {
      errorMessage = 'Primer Nombre: Acepta letras, tildes y espacios.';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(segundo_nombre)) {
      errorMessage = 'Segundo Nombre: Acepta letras, tildes y espacios.';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(primer_apellido)) {
      errorMessage = 'Primer Apellido: Acepta letras, tildes y espacios.';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(segundo_apellido)) {
      errorMessage = 'Segundo Apellido: Acepta letras, tildes y espacios.';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(username)) {
      errorMessage = 'Username: Acepta letras, tildes y espacios.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMessage = 'Email: Debe ser un correo electrónico válido.';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}/.test(password)) {
      errorMessage = 'Password: Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
      isValid = false;
    }

    setError(errorMessage);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateFields()) {
      try {
        const response = await fetch('http://192.168.0.11:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, username, password }),
        });

        const data = await response.json();

        if (data.success) {
          setAlertMessage(data.message || 'Registro exitoso');
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
            navigation.navigate('Login');
          }, 1000); // Tiempo de espera de 1 segundos
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Error de conexión');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Primer Nombre" 
            placeholderTextColor="#ddd" 
            value={primer_nombre} 
            onChangeText={setPrimerNombre} 
          />
          <Text style={styles.validationText}>Acepta letras, tildes y espacios.</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Segundo Nombre" 
            placeholderTextColor="#ddd" 
            value={segundo_nombre} 
            onChangeText={setSegundoNombre} 
          />
          <Text style={styles.validationText}>Acepta letras, tildes y espacios.</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Primer Apellido" 
            placeholderTextColor="#ddd" 
            value={primer_apellido} 
            onChangeText={setPrimerApellido} 
          />
          <Text style={styles.validationText}>Acepta letras, tildes y espacios.</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Segundo Apellido" 
            placeholderTextColor="#ddd" 
            value={segundo_apellido} 
            onChangeText={setSegundoApellido} 
          />
          <Text style={styles.validationText}>Acepta letras, tildes y espacios.</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#ddd" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.validationText}>Debe ser un correo electrónico válido.</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Username" 
            placeholderTextColor="#ddd" 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none"
          />
          <Text style={styles.validationText}>Acepta letras, tildes y espacios.</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#ddd" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
          <Text style={styles.validationText}>
            Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
          </Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButtonText}>Ir a Inicio de Sesión</Text>
          </TouchableOpacity>
        </View>
        {showAlert && <CustomAlert message={alertMessage} onDismiss={() => setShowAlert(false)} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#005bb5', // Nuevo tono azul para el borde
    borderRadius: 5,
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#005bb5', // Nuevo tono azul para el fondo del botón
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  backButtonContainer: {
    marginTop: 10,
    width: '100%',
  },
  backButton: {
    padding: 15,
    backgroundColor: '#005bb5', // Nuevo tono azul para el fondo del botón de regreso
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  validationText: {
    fontSize: 12,
    color: 'gray',
  },
});
