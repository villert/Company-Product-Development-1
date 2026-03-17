// screens/Auth.js
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseApp } from '../firebase' // your Firebase config file

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export default function Auth({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Please fill all fields')
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        status: 'online'
      })
      navigation.navigate('Tabs')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please fill all fields')
      return
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      navigation.navigate('Tabs')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const handleGuest = async () => {
    try {
      const userCredential = await signInAnonymously(auth)
      const uid = userCredential.user.uid
      await setDoc(doc(db, 'users', uid), {
        status: 'guest',
        createdAt: serverTimestamp()
      })
      navigation.navigate('Tabs')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Foodi_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {isRegister && (
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {isRegister ? (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.toggleText}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#8dc9a4' },
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#fff' },
  button: { backgroundColor: '#ffffff', padding: 15, borderRadius: 5, marginVertical: 10 },
    buttonText: {  textAlign: 'center', fontWeight: 'bold' },
  toggleText: { textAlign: 'center', marginVertical: 5 },
  guestButton: { padding: 15, borderRadius: 5, borderWidth: 1, borderColor: '#4A90E2', backgroundColor: '#ffffff', marginTop: 10 },
  guestText: { textAlign: 'center', fontWeight: 'bold' }
})