import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Detail: undefined;
  Video: { uri: string; title: string };
};

type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

type Props = {
  route: any; // Ajusta el tipo según sea necesario
  navigation: DetailScreenNavigationProp;
};

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { video } = route.params;

  if (!video) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Datos del video no disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: video.url_imagen }} 
        style={styles.image}
        onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.nombre}</Text>
        <Text style={styles.subtitle}>{video.nombre_categoria}</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('Video', { uri: video.url_video, title: video.nombre })}
        >
          <Text style={styles.playButtonText}>Reproducir</Text>
        </TouchableOpacity>
        <Text style={styles.description}>{video.sinopsis}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: '#333', // Añadir un color de fondo mientras se carga la imagen
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  playButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default DetailScreen;
