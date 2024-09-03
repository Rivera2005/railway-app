import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Home: undefined;
  Video: { uri: string; title: string; sinopsis: string };
  Detail: { video: Video };
  Profile: undefined;
  SavedMovies: undefined;
};

type SavedMoviesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SavedMovies"
>;

type Props = {
  navigation: SavedMoviesScreenNavigationProp;
};

interface Video {
  id: string;
  nombre: string;
  url_video: string;
  url_imagen: string;
  nombre_categoria: string;
  sinopsis: string;
}

const SavedMoviesScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState<Video[]>([]);
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        setLoading(true);
        const accountIdString = await AsyncStorage.getItem("accountId");
        const accountId = accountIdString ? parseInt(accountIdString, 10) : null;

        if (accountId !== null) {
          const response = await fetch(
            `http://192.168.0.11:5000/guardadas/${accountId}`
          );
          const result = await response.json();
          if (result.success) {
            setSavedMovies(result.movies);
          } else {
            console.error("Error al obtener las películas guardadas:", result.message);
          }
        } else {
          console.error("Account ID not found in storage");
        }
      } catch (error) {
        console.error("Error al obtener las películas guardadas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMovies();
  }, []);

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={[styles.videoItem, { width: width / numColumns - 20 }]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Video", {
            uri: item.url_video,
            title: item.nombre,
            sinopsis: item.sinopsis,
          })
        }
      >
        <Image
          source={{ uri: item.url_imagen }}
          style={styles.thumbnail}
          onError={(e) =>
            console.error("Error loading image:", e.nativeEvent.error)
          }
        />
      </TouchableOpacity>
      
      <Text style={styles.category}>{item.nombre_categoria}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() =>
            navigation.navigate("Video", {
              uri: item.url_video,
              title: item.nombre,
              sinopsis: item.sinopsis,
            })
          }
        >
          <Ionicons name="play-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Reproducir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate("Detail", { video: item })}
        >
          <Ionicons name="information-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Películas Guardadas</Text>
      </View>
      <FlatList
        data={savedMovies}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  videoItem: {
    margin: 5,
    backgroundColor: "#333",
    borderRadius: 5,
    overflow: "hidden",
    padding: 10,
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  category: {
    color: "#999",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "space-between",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#005bb5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    flexGrow: 1,
    justifyContent: "center",
    marginRight: 5,
    paddingRight: 20,
    paddingLeft: 18,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    flexGrow: 1,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

export default SavedMoviesScreen;
