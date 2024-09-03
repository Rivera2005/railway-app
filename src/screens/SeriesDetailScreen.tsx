import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  SeriesDetail: { seriesId: string };
  Video: { uri: string; title: string; sinopsis: string };
};

type SeriesDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SeriesDetail"
>;
type SeriesDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "SeriesDetail"
>;

type Props = {
  navigation: SeriesDetailScreenNavigationProp;
  route: SeriesDetailScreenRouteProp;
};

interface Episode {
  id: string;
  nombre: string;
  url_video: string;
  url_imagen: string;
  temporada: number;
  numero_episodio: number;
  sinopsis: string;
}

interface Series {
  id: string;
  nombre: string;
  sinopsis: string;
  url_imagen: string;
  temporadas: number;
  episodios: Episode[];
}

const SeriesDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { seriesId } = route.params;
  const [series, setSeries] = useState<Series | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://192.168.0.11:5000/series/${seriesId}`
        );
        const data = await response.json();
        setSeries(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching series details:", error);
        setLoading(false);
      }
    };

    fetchSeriesDetails();
  }, [seriesId]);

  const renderEpisodeItem = ({ item }: { item: Episode }) => (
    <TouchableOpacity
      style={styles.episodeItem}
      onPress={() =>
        navigation.navigate("Video", {
          uri: item.url_video,
          title: `${item.nombre} - Episodio ${item.numero_episodio}`,
          sinopsis: item.sinopsis,
        })
      }
    >
      <Image source={{ uri: item.url_imagen }} style={styles.episodeThumbnail} />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>
          Episodio {item.numero_episodio}: {item.nombre}
        </Text>
        <Text style={styles.episodeSinopsis} numberOfLines={2}>
          {item.sinopsis}
        </Text>
      </View>
      <Ionicons name="play-circle-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!series) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los detalles de la serie</Text>
      </View>
    );
  }

  const filteredEpisodes = series.episodios.filter(
    (episode) => episode.temporada === selectedSeason
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: series.url_imagen }} style={styles.seriesBanner} />
      <Text style={styles.seriesTitle}>{series.nombre}</Text>
      <Text style={styles.seriesSinopsis}>{series.sinopsis}</Text>
      <View style={styles.seasonPickerContainer}>
        <Picker
          selectedValue={selectedSeason}
          onValueChange={(itemValue) => setSelectedSeason(Number(itemValue))}
          style={styles.seasonPicker}
        >
          {Array.from({ length: series.temporadas }, (_, i) => i + 1).map(
            (season) => (
              <Picker.Item
                key={season}
                label={`Temporada ${season}`}
                value={season}
              />
            )
          )}
        </Picker>
      </View>
      <FlatList
        data={filteredEpisodes}
        renderItem={renderEpisodeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.episodeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
  },
  seriesBanner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  seriesTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
  },
  seriesSinopsis: {
    color: "#ccc",
    fontSize: 14,
    padding: 10,
  },
  seasonPickerContainer: {
    backgroundColor: "#333",
    margin: 10,
    borderRadius: 5,
  },
  seasonPicker: {
    color: "#fff",
  },
  episodeList: {
    paddingHorizontal: 10,
  },
  episodeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    marginBottom: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  episodeThumbnail: {
    width: 100,
    height: 56,
    resizeMode: "cover",
  },
  episodeInfo: {
    flex: 1,
    padding: 10,
  },
  episodeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  episodeSinopsis: {
    color: "#ccc",
    fontSize: 12,
  },
});

export default SeriesDetailScreen;