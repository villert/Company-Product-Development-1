// screens/ChatScreen.js
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, SafeAreaView } from 'react-native'
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from '../firebase'

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [currentUserName, setCurrentUserName] = useState('Guest')

  // Fetch current user's name from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      if (!auth.currentUser) return
      const docRef = doc(db, 'users', auth.currentUser.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setCurrentUserName(docSnap.data().name || 'Guest')
      }
    }
    fetchUserName()
  }, [])

  // Listen for messages
  useEffect(() => {
    const q = query(collection(db, 'chats', 'general', 'messages'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [])

  const handleSend = async () => {
    if (!text.trim()) return
    await addDoc(collection(db, 'chats', 'general', 'messages'), {
      text: text,
      senderId: auth.currentUser.uid,
      senderName: currentUserName,
      createdAt: serverTimestamp()
    })
    setText('')
  }

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.senderId === auth.currentUser.uid && styles.myMessage]}>
      <Text style={styles.sender}>{item.senderName}</Text>
      <Text>{item.text}</Text>
    </View>
  )

  // Custom top header
  const ChatHeader = () => (
    <SafeAreaView style={{ backgroundColor: '#8dc9a4' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtn}>Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/Foodi_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={{ width: 60 }} />
      </View>
    </SafeAreaView>
  )

  return (
    <View style={styles.container}>
      <ChatHeader />
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerBtn: {fontWeight: 'bold', fontSize: 16 },
  logo: { width: 100, height: 120, alignSelf: 'center' },

  message: { 
    padding: 10, 
    backgroundColor: '#d6f9df', 
    borderRadius: 5, 
    marginBottom: 5,
    maxWidth: '70%'
  },
  myMessage: { 
    backgroundColor: '#8dc9a4', 
    alignSelf: 'flex-end',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    maxWidth: '70%'
  },
  sender: { fontWeight: 'bold', marginBottom: 2 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10 },
  button: { backgroundColor: '#8dc9a4', padding: 10, borderRadius: 5 },
  buttonText: {fontWeight: 'bold' }
})