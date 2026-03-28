// screens/Auth.js
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseApp } from '../firebase'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const getFirebaseErrorMessage = (code, t) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return t('emailInUse');
    case 'auth/invalid-email':
      return t('invalidEmail');
    case 'auth/user-not-found':
      return t('userNotFound');
    case 'auth/wrong-password':
      return t('wrongPassword');
    case 'auth/weak-password':
      return t('weakPassword');
    default:
      return t('unknownError');
  }
};

export default function Auth({ navigation }) {
  const {t} = useLanguage()
  const { colors, isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert(t('error'), t('fillAllFields')); return }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name, email, createdAt: serverTimestamp(), status: 'online'
      })
      navigation.navigate('Tabs')
    } catch (error) { Alert.alert(t('error'), getFirebaseErrorMessage(error.code, t)) }
  }

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert(t('error'), t('fillAllFields')); return }
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigation.navigate('Tabs')
    } catch (error) { Alert.alert(t('error'), getFirebaseErrorMessage(error.code, t)) }
  }

  const handleGuest = async () => {
    try {
      const userCredential = await signInAnonymously(auth)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        status: 'guest', createdAt: serverTimestamp()
      })
      navigation.navigate('Tabs')
    } catch (error) { Alert.alert(t('error'), getFirebaseErrorMessage(error.code, t)) }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.header }]}>
      <Image
        source={isDark ? require('../assets/Foodi_logo_white.png') : require('../assets/Foodi_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {isRegister && (
        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.subText}
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        />
      )}
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.subText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.subText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.card }]}
        onPress={isRegister ? handleRegister : handleLogin}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {isRegister ? 'Register' : 'Login'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={[styles.toggleText, { color: colors.headerText }]}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.guestButton, { backgroundColor: colors.card, borderColor: '#4A90E2' }]}
        onPress={handleGuest}
      >
        <Text style={[styles.guestText, { color: colors.text }]}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 5 },
  button: { padding: 15, borderRadius: 5, marginVertical: 10 },
  buttonText: { textAlign: 'center', fontWeight: 'bold' },
  toggleText: { textAlign: 'center', marginVertical: 5 },
  guestButton: { padding: 15, borderRadius: 5, borderWidth: 1, marginTop: 10 },
  guestText: { textAlign: 'center', fontWeight: 'bold' },
})