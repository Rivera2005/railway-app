import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
  SectionList,
  Modal,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type RootStackParamList = {
  Home: undefined;
  Video: { uri: string; title: string; sinopsis: string };
  Detail: { video: Video };
  Profile: undefined;
  Episodes: { seriesId: string; seriesName: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

interface Video {
  id: string;
  nombre: string;
  url_video: string;
  url_imagen: string;
  nombre_categoria: string;
  fecha_subida: string;
  sinopsis: string;
  tipo: "pelicula" | "episodio";
  nombre_serie?: string;
  serie_id?: string;
}

interface SeriesGroup {
  title: string;
  data: Video[];
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<{
    id: number;
    nombre: string;
  }>({ id: 0, nombre: "Todos los géneros" });
  const [selectedContentType, setSelectedContentType] =
    useState<string>("Todos");
  const [categories, setCategories] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Video[]>([]);
  const [series, setSeries] = useState<SeriesGroup[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // States for like, dislike, and watchlist
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [dislikedVideos, setDislikedVideos] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const storedWatchlist = await AsyncStorage.getItem("watchlist");
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist));
        }
      } catch (error) {
        console.error("Error loading watchlist:", error);
      }
    };

    loadWatchlist();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [moviesResponse, seriesResponse, categoriesResponse] =
          await Promise.all([
            fetch("http://192.168.0.11:5000/movies"),
            fetch("http://192.168.0.11:5000/series"),
            fetch("http://192.168.0.11:5000/categories"),
          ]);
        const [moviesData, seriesData, categoriesData] = await Promise.all([
          moviesResponse.json(),
          seriesResponse.json(),
          categoriesResponse.json(),
        ]);
        setMovies(moviesData);
        setSeries(seriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al obtener el contenido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredContent = useMemo(() => {
    const genreName = selectedGenre.nombre.toLowerCase();

    const filterContent = (content: Video[]) => {
      return content.filter((item) => {
        const videoCategories = item.nombre_categoria
          ? item.nombre_categoria
              .split(",")
              .map((cat) => cat.trim().toLowerCase())
          : [];
        const isInSelectedGenre =
          selectedGenre.nombre === "Todos los géneros" ||
          videoCategories.includes(genreName);
        const isInSearchQuery = item.nombre
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return isInSelectedGenre && isInSearchQuery;
      });
    };

    if (selectedContentType === "Películas") {
      return filterContent(movies);
    } else if (selectedContentType === "Series") {
      return series
        .map((seriesGroup) => ({
          ...seriesGroup,
          data: filterContent(seriesGroup.data),
        }))
        .filter((seriesGroup) => seriesGroup.data.length > 0);
    } else {
      const filteredMovies = filterContent(movies);
      const filteredSeriesEpisodes = series
        .map((seriesGroup) => filterContent(seriesGroup.data))
        .flat();
      return [...filteredMovies, ...filteredSeriesEpisodes];
    }
  }, [searchQuery, selectedGenre, selectedContentType, movies, series]);

  const handleLike = (videoId: string) => {
    if (likedVideos.includes(videoId)) {
      setLikedVideos(likedVideos.filter((id) => id !== videoId));
    } else {
      setLikedVideos([...likedVideos, videoId]);
      setDislikedVideos(dislikedVideos.filter((id) => id !== videoId));
    }
  };

  const handleDislike = (videoId: string) => {
    if (dislikedVideos.includes(videoId)) {
      setDislikedVideos(dislikedVideos.filter((id) => id !== videoId));
    } else {
      setDislikedVideos([...dislikedVideos, videoId]);
      setLikedVideos(likedVideos.filter((id) => id !== videoId));
    }
  };

  const handleAddToWatchlist = (videoId: string) => {
    if (watchlist.includes(videoId)) {
      setWatchlist(watchlist.filter((id) => id !== videoId));
    } else {
      setWatchlist([...watchlist, videoId]);
    }
  };

  const handleSaveFavorite = async (videoId: string) => {
    try {
      const accountIdString = await AsyncStorage.getItem("accountId");
      const accountId = accountIdString ? parseInt(accountIdString, 10) : null;

      if (accountId !== null) {
        const response = await fetch("http://192.168.0.11:5000/guardadas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: accountId, // Aquí se usa el accountId en lugar de un valor fijo
            movieId: videoId,
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log("Película guardada como favorita exitosamente");
          setWatchlist((prevWatchlist) => [...prevWatchlist, videoId]); // Actualiza el estado
        } else {
          console.error(
            "Error al guardar la película como favorita:",
            result.message
          );
        }
      } else {
        console.error("Account ID not found in storage");
      }
    } catch (error) {
      console.error("Error al guardar la película como favorita:", error);
    }
  };

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
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {item.tipo === "episodio"
          ? `${item.nombre_serie}: ${item.nombre}`
          : item.nombre}
      </Text>
      <Text style={styles.category}>{item.nombre_categoria}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSaveFavorite(item.id)}
        >
          <Ionicons
            name={watchlist.includes(item.id) ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
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
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate("Detail", { video: item })}
        >
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: SeriesGroup;
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="menu" size={24} color="#005bb5" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar películas o series..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGenre.nombre}
          onValueChange={(itemValue) => {
            const selected = categories.find((cat) => cat.nombre === itemValue);
            setSelectedGenre({ id: selected?.id || 0, nombre: itemValue });
          }}
          style={styles.picker}
          dropdownIconColor="#005bb5"
        >
          <Picker.Item label="Géneros" value="Todos los géneros" />
          {categories.map((genre) => (
            <Picker.Item
              key={genre.id}
              label={genre.nombre}
              value={genre.nombre}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedContentType}
          onValueChange={(itemValue) => setSelectedContentType(itemValue)}
          style={styles.picker}
          dropdownIconColor="#005bb5"
        >
          <Picker.Item label="Todos" value="Todos" />
          <Picker.Item label="Películas" value="Películas" />
          <Picker.Item label="Series" value="Series" />
        </Picker>
      </View>
      {selectedContentType === "Series" ? (
        <SectionList
          sections={filteredContent as SeriesGroup[]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVideoItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          key={numColumns}
          data={filteredContent as Video[]}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={numColumns > 1 ? styles.row : null}
        />
      )}

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Profile");
              }}
            >
              <Text style={styles.modalText}>Configurar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("SavedMovies");
              }}
            >
              <Text style={styles.modalText}>Películas Guardadas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.logoutOption]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Main");
              }}
            >
              <Text style={styles.modalText}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 10,
    paddingTop: 0,
    paddingBottom: 15,
    justifyContent: "space-between",
  },
  searchInput: {
    height: 40,
    borderColor: "#005bb5",
    borderBottomWidth: 2,
    color: "#fff",
    paddingHorizontal: 10,
    width: 240, // Ajusta el ancho si es necesario
    backgroundColor: "#222", // Fondo del campo de búsqueda para contrastar
    borderRadius: 5, // Bordes redondeados opcionales
  },
  menuButton: {
    padding: 2,
    borderColor: "#005bb5",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    
  },
  picker: {
    flex: 1,
    color: "#fff",
    borderRadius: 5,
    marginHorizontal: 5,
    padding: 0,
    backgroundColor: "005bb5",
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
  actionButton: {
    backgroundColor: "#444",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#005bb5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 5,
    flexGrow: 1,
    justifyContent: "center",
    marginRight: 5,
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
  sectionHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
    
  },
  gridContainer: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 91, 181, 0.8)", // Un tono azul oscuro
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#005bb5", // Azul más brillante para el borde
  },
  modalText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  logoutOption: {
    backgroundColor: "#003d7a", // Azul para el botón de logout
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
});

export default HomeScreen;
