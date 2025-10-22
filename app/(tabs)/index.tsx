import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
  View,
  Text,
  Button,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        } else {
          Alert.alert('Exit App', 'Do you want to exit?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        }
      });
      return () => backHandler.remove();
    }
  }, [canGoBack]);

  const handleReload = () => {
    setError(false);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load the page 😕</Text>
          <Button title="Retry" onPress={handleReload} />
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://archisans.com' }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          onError={() => setError(true)}
          style={{ flex: 1 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // 👈 color around camera notch / status bar
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});
