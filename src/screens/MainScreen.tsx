import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Button,
  Dimensions,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type MainScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login' | 'Register'
>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MainScreen({ navigation }: Props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % 4; // Asumiendo que tienes 4 imágenes
      scrollRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
      setActiveIndex(nextIndex);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const questions = [
    '¿Qué es la app?',
    '¿Cuánto cuesta?',
    '¿Dónde puedo ver?',
    '¿Cómo cancelo?',
    '¿Qué puedo ver en la app?',
  ];

  const answers = [
    'Esta es una aplicación de streaming donde puedes ver series y películas.',
    'La aplicación es gratuita, pero algunas características pueden requerir una suscripción.',
    'Puedes ver el contenido en cualquier dispositivo compatible con nuestra aplicación.',
    'Puedes cancelar en cualquier momento desde la configuración de tu cuenta.',
    'La aplicación ofrece una variedad de contenido, incluyendo series, películas, y documentales.',
  ];

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <Image source={require('../../assets/logostream2.png')} style={styles.logo} />
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handleLoginPress}>
            <View style={styles.loginButton}>
              <Text style={styles.navButtonText}>Iniciar Sesión</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.threeDotsButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.threeDotsText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for FAQ */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalText}>Preguntas Frecuentes</Text>
              {questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                  <TouchableOpacity onPress={() => toggleQuestion(index)}>
                    <View style={styles.questionRow}>
                      <Text style={styles.questionText}>{question}</Text>
                      <Text style={styles.plusSign}>{expandedQuestion === index ? '-' : '+'}</Text>
                    </View>
                  </TouchableOpacity>
                  {expandedQuestion === index && (
                    <Text style={styles.answerText}>{answers[index]}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          ref={scrollRef}
        >
          <Image source={require('../../assets/inicio.png')} style={styles.carouselImage} />
          <Image source={require('../../assets/inicio1.png')} style={styles.carouselImage} />
          <Image source={require('../../assets/inicio2.png')} style={styles.carouselImage} />
          <Image source={require('../../assets/inicio3.png')} style={styles.carouselImage} />
        </ScrollView>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {Array.from({ length: 4 }).map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return <Animated.View key={index} style={[styles.dot, { opacity }]} />;
        })}
      </View>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>Comienza ya</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  navBar: {
    position: 'absolute',
    top: -10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 2,
  },
  logo: {
    width: 50,
    height: 50,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#0073e6',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },
  threeDotsButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  threeDotsText: {
    color: 'white',
    fontSize: 30,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  questionText: {
    fontSize: 16,
  },
  plusSign: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  answerText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  carouselContainer: {
    flex: 1,
    position: 'relative',
  },
  carouselImage: {
    width: screenWidth,
    height: screenHeight + 20,
    resizeMode: 'cover',
  },
  title: {
    position: 'absolute',
    top: screenHeight * 0.65,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 115, // Ajusta esta propiedad para mover los dots más arriba
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    zIndex: 2,
  },
  buttonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0073e6',
    paddingVertical: 15,
    paddingHorizontal: 105,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
