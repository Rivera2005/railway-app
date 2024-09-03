import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../src/screens/LoginScreen";
import HomeScreen from "../src/screens/HomeScreen";
import RegisterScreen from "../src/screens/RegisterScreen";
import DetailScreen from "../src/screens/DetailScreen";
import VideoScreen from "../src/screens/VideoScreen"; // Asegúrate de que este componente esté bien definido
import MainScreen from "../src/screens/MainScreen";
import SeriesScreen from "../src/screens/SeriesScreen"; // Ajusta la ruta según tu estructura de archivos
import ProfileScreen from "../src/screens/ProfileScreen";
import SavedMoviesScreen from "../src/screens/SavedMoviesScreen";

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Detail: undefined;
  Video: undefined;
  Series: undefined;
  Profile: undefined; // Añadido el nuevo screen
  SavedMovies: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen
          name="Video"
          component={VideoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SavedMovies" component={SavedMoviesScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="Series" component={SeriesScreen} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
