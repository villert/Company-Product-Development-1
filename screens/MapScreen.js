// screens/MapScreen.js
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { useTheme } from '../context/ThemeContext'

const RESTAURANTS = [
  { name: 'Mara', latitude: 65.06110471036246, longitude: 25.468047624196284 },
  { name: 'Julinia', latitude: 65.06091260085284, longitude: 25.466415391425453 },
]

export default function MapScreen() {
  const { isDark, colors } = useTheme()

  const leafletHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: ${colors.background}; font-family: sans-serif; }
    #header {
      background-color: ${colors.header};
      text-align: center;
      padding: 14px;
      font-size: 18px;
      font-weight: bold;
      color: ${colors.headerText};
      letter-spacing: 1px;
    }
    #map { width: 100vw; height: calc(100vh - 50px); }
  </style>
</head>
<body>
  <div id="header">Location of the Restaurants</div>
  <div id="map"></div>
  <script>
    const map = L.map('map').setView([65.06100, 25.46723], 16);
    L.tileLayer(
      ${isDark
        ? "'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'"
        : "'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
      },
      { attribution: '© OpenStreetMap © CARTO' }
    ).addTo(map);
    const restaurants = ${JSON.stringify(RESTAURANTS)};
    restaurants.forEach(r => {
      L.marker([r.latitude, r.longitude]).addTo(map).bindPopup(r.name);
    });
  </script>
</body>
</html>
`

  return (
    <View style={styles.container}>
      <WebView
        key={isDark ? 'dark-map' : 'light-map'}
        source={{ html: leafletHTML }}
        style={styles.map}
        javaScriptEnabled
        originWhitelist={['*']}
        cacheEnabled
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
})
