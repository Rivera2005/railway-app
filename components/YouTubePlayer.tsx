// components/YouTubePlayer.tsx
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface YouTubePlayerProps {
  videoId: string;
  height: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, height }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&rel=0`;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height }]}>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        style={styles.webview}
        source={{ uri: embedUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});

export default YouTubePlayer;