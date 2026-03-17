// screens/MapScreen.js
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

const RESTAURANTS = [
  { name: 'Mara', latitude: 65.06110471036246, longitude: 25.468047624196284 },
  { name: 'Julinia', latitude: 65.06091260085284, longitude: 25.466415391425453 },
]

const leafletHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #d6f9df; font-family: sans-serif; }
    #header {
      background-color: #8dc9a4;
      text-align: center;
      padding: 14px;
      font-size: 18px;
      font-weight: bold;
      color: #1a3a1a;
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
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);

    const restaurants = ${JSON.stringify(RESTAURANTS)};
    restaurants.forEach(r => {
      L.marker([r.latitude, r.longitude])
        .addTo(map)
        .bindPopup(r.name)
    });
  </script>
</body>
</html>
`

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ html: leafletHTML }}
        style={styles.map}
        javaScriptEnabled={true}
        originWhitelist={['*']}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
})