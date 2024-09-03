import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios'; // Asegúrate de tener axios instalado

type RootStackParamList = {
  Series: { series: Series };
  Video: { uri: string; title: string; sinopsis: string };
};

type SeriesScreenRouteProp = RouteProp<RootStackParamList, 'Series'>;
type SeriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Series'>;

type Props = {
  route: SeriesScreenRouteProp;
  navigation: SeriesScreenNavigationProp;
};

interface Series {
  id: string;
  nombre: string;
  descripcion: string;
  num_temporadas: number;
  num_episodios: number;
  temporadas?: Temporada[];
  episodios?: Video[];
}

interface Temporada {
  id: number;
  numero: number;
  nombre: string;
}

interface Video {
  id: number;
  nombre: string;
  url_video: string;
  url_imagen: string;
  sinopsis: string;
  temporada_numero: number;
}

const SeriesScreen: React.FC<Props> = ({ route, navigation }) => {
  const { series } = route.params;
  const [selectedTemporada, setSelectedTemporada] = useState<Temporada | null>(null);
  const [episodios, setEpisodios] = useState<Video[]>([]);

  useEffect(() => {
    console.log('Series Data:', series);

    if (series.temporadas && series.temporadas.length > 0) {
      setSelectedTemporada(series.temporadas[0]);
    }
  }, [series]);

  useEffect(() => {
    if (selectedTemporada) {
      console.log('Selected Temporada:', selectedTemporada);
      const episodiosTemporada = series.episodios?.filter(e => e.temporada_numero === selectedTemporada.numero) || [];
      setEpisodios(episodiosTemporada);
    }
  }, [selectedTemporada, series.episodios]);

  const renderTemporadaItem = ({ item }: { item: Temporada }) => (
    <TouchableOpacity
      style={[
        styles.temporadaItem,
        selectedTemporada?.id === item.id && styles.selectedTemporada
      ]}
      onPress={() => {
        console.log('Temporada seleccionada:', item);
        setSelectedTemporada(item);
      }}
    >
      <Text style={styles.temporadaText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => navigation.navigate('Video', { uri: item.url_video, title: item.nombre, sinopsis: item.sinopsis })}
    >
      <Image source={{ uri: item.url_imagen }} style={styles.thumbnail} />
      <Text style={styles.videoTitle}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  if (!series) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: Series data not available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{series.nombre}</Text>
      <Text style={styles.description}>{series.descripcion}</Text>

      <FlatList
        horizontal
        data={series.temporadas || []}
        renderItem={renderTemporadaItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.temporadasList}
      />

      {selectedTemporada && (
        <View>
          <Text style={styles.temporadaTitle}>{selectedTemporada.nombre}</Text>
          <FlatList
            data={episodios}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.videosList}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  temporadasList: {
    marginBottom: 20,
  },
  temporadaItem: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  selectedTemporada: {
    backgroundColor: '#555',
  },
  temporadaText: {
    color: 'white',
  },
  temporadaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  videosList: {
    marginTop: 10,
  },
  videoItem: {
    marginBottom: 20,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  videoTitle: {
    color: 'white',
    marginTop: 5,
  },
});

export default SeriesScreen
