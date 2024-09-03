import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Video, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

type RootStackParamList = {
  Video: { uri: string; title: string; sinopsis: string };
};

type VideoScreenRouteProp = RouteProp<RootStackParamList, 'Video'>;
type VideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Video'>;

type Props = {
  route: VideoScreenRouteProp;
  navigation: VideoScreenNavigationProp;
};

const VideoScreen: React.FC<Props> = ({ route, navigation }) => {
  const { uri, title, sinopsis } = route.params;
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    navigation.setOptions({ title });

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [navigation, title]);

  useEffect(() => {
    if (status?.isLoaded) {
      setPositionMillis(status.positionMillis || 0);
      setDurationMillis(status.durationMillis || 0);
    }
  }, [status]);

  const handlePlayPause = () => {
    if (status?.isLoaded) {
      if (status.isPlaying) {
        videoRef.current?.pauseAsync();
      } else {
        videoRef.current?.playAsync();
      }
    }
  };

  const handleSliderValueChange = async (value: number) => {
    if (status?.isLoaded && durationMillis) {
      const seekPosition = value * durationMillis;
      await videoRef.current?.setPositionAsync(seekPosition);
      setPositionMillis(seekPosition);
    }
  };

  const toggleFullScreen = async () => {
    if (isFullScreen) {
      videoRef.current?.dismissFullscreenPlayer();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      videoRef.current?.presentFullscreenPlayer();
    }
    setIsFullScreen(!isFullScreen);
  };

  const formatTime = (millis: number) => {
    const date = new Date(millis);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={isFullScreen ? styles.fullscreenVideoContainer : styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={isFullScreen ? "contain" : "contain"}
            shouldPlay={false}
            useNativeControls={false}
            style={styles.video}
            onPlaybackStatusUpdate={(status) => {
              setStatus(status);
              if (status.isLoaded) {
                setPositionMillis(status.positionMillis || 0);
                setDurationMillis(status.durationMillis || 0);
              }
            }}
          />
          <View style={styles.controlOverlay}>
            <TouchableOpacity onPress={handlePlayPause}>
              <Ionicons
                name={status?.isLoaded && status.isPlaying ? 'pause' : 'play'}
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFullScreen}>
              <Ionicons
                name={isFullScreen ? 'contract' : 'expand'}
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.controls}>
          <Slider
            style={{ flex: 1 }}
            value={
              status?.isLoaded && positionMillis && durationMillis
                ? positionMillis / durationMillis
                : 0
            }
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onSlidingComplete={handleSliderValueChange}
            disabled={!status?.isLoaded}
          />
          <Text style={styles.duration}>
            {status?.isLoaded && positionMillis
              ? formatTime(positionMillis)
              : '00:00'}{' '}
            /{' '}
            {status?.isLoaded && durationMillis
              ? formatTime(durationMillis)
              : '00:00'}
          </Text>
        </View>
        {!isFullScreen && (
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{sinopsis}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  fullscreenVideoContainer: {
    width: '100%', // Mantener el ancho al 100%
    height: Dimensions.get('window').height * 0.85, // Reducido un 15% del alto original
    backgroundColor: '#000',
    alignSelf: 'center', // Centrar el video
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  infoContainer: {
    padding: 15,
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
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  duration: {
    color: 'white',
    marginLeft: 10,
  },
});

export default VideoScreen;
