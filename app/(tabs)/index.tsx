import React, { useRef, useState, useEffect } from "react";
import { BackHandler, SafeAreaView, ActivityIndicator, Linking } from "react-native";
import { WebView } from "react-native-webview";

export default function Index() {
  const webRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  const WEBSITE_URL = "https://www.flipkart.com/"; // 👈 replace with your website

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [canGoBack]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
      <WebView
        ref={webRef}
        source={{ uri: WEBSITE_URL }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
        originWhitelist={["https://*", "http://*"]}
        onShouldStartLoadWithRequest={(request) => {
          const allowedDomain = "your-website-url.com"; // 👈 replace with your domain
          if (!request.url.includes(allowedDomain)) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        startInLoadingState
      />
    </SafeAreaView>
  );
}
