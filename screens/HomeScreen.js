// screens/HomeScreen.js
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import * as Location from 'expo-location'

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
}

const RESTAURANTS = [
  {
    id: '1',
    name: 'Mara',
    price: '1,24 € / 4,78 € / 10,90 €',
    reviews: '4.2 ⭐ (37 reviews)',
    latitude: 65.06110471036246,
    longitude: 25.468047624196284,
  },
  {
    id: '2',
    name: 'Julinia',
    price: '0,69 € / 1,29 € / 2,49 €',
    reviews: '3.8 ⭐ (40 reviews)',
    latitude: 65.06091260085284,
    longitude: 25.466415391425453,
  },
]

export default function HomeScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null)

 useEffect(() => {
  ;(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setUserLocation({ latitude: 65.0322, longitude: 25.4626 })
        return
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low, // less strict, works better on emulator
      })
      setUserLocation(location.coords)
    } catch (error) {
      console.warn('Location error, using default:', error)
      setUserLocation({ latitude: 65.0322, longitude: 25.4626 }) // fallback to Oulu
    }
  })()
}, [])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Restaurants</Text>
      {RESTAURANTS.map(item => {
  const distance = userLocation
    ? getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude
      ) + ' km'
    : 'Locating...'
  return (
    <Pressable
      key={item.id}
      onPress={() => navigation.navigate('List', { restaurantName: item.name })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>{item.price}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Distance</Text>
        <Text style={styles.value}>{distance}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Reviews</Text>
        <Text style={styles.value}>{item.reviews}</Text>
      </View>
    </Pressable>
  )
})}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d6f9df', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a3a1a',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1a3a1a', marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 14, color: '#555' },
  value: { fontSize: 14, fontWeight: '500', color: '#222' },
})