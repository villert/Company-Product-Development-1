// screens/ChatScreen.js
import React, { useEffect, useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Image, SafeAreaView
} from 'react-native'
import {
  getFirestore, collection, addDoc, query, orderBy,
  onSnapshot, serverTimestamp, doc, getDoc
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from '../firebase'

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

// Cache for sender profile data { uid: { name, photoURL } }
const senderCache = {}

function Avatar({ name, photoURL, size = 32 }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (photoURL) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    )
  }

  // Generate a consistent color from the name
  const colors = ['#f28b82', '#fbbc04', '#34a853', '#4285f4', '#a142f4', '#ff6d00', '#00bcd4']
  const colorIndex = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
    : 0

  return (
    <View style={[
      styles.avatar,
      styles.avatarFallback,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: colors[colorIndex] }
    ]}>
      <Text style={[styles.avatarInitials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  )
}

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', photoURL: null })
  const [senderProfiles, setSenderProfiles] = useState({})
  const [currentUid, setCurrentUid] = useState(null)
  const flatListRef = useRef(null)

  // Fetch current user's profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!auth.currentUser) return
      setCurrentUid(auth.currentUser.uid) // always set, even for guests
      if (auth.currentUser.isAnonymous) return // guests have no Firestore doc
      const docRef = doc(db, 'users', auth.currentUser.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrentUser({
          name: data.name || 'Guest',
          photoURL: data.photoURL || null,
        })
      }
    }
    fetchUserProfile()
  }, [])

  // Fetch a sender's profile (with cache)
  const fetchSenderProfile = async (senderId) => {
    if (senderCache[senderId]) return
    senderCache[senderId] = true // prevent duplicate fetches
    const docRef = doc(db, 'users', senderId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      senderCache[senderId] = { name: data.name || 'Guest', photoURL: data.photoURL || null }
      setSenderProfiles(prev => ({ ...prev, [senderId]: senderCache[senderId] }))
    }
  }

  // Listen for messages
  useEffect(() => {
    const q = query(collection(db, 'chats', 'general', 'messages'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setMessages(msgs)
      // Fetch profiles for any new senders
      msgs.forEach(msg => {
        if (msg.senderId && !senderCache[msg.senderId]) {
          fetchSenderProfile(msg.senderId)
        }
      })
    })
    return () => unsubscribe()
  }, [])

  const handleSend = async () => {
    if (!text.trim()) return
    await addDoc(collection(db, 'chats', 'general', 'messages'), {
      text: text.trim(),
      senderId: auth.currentUser.uid,
      senderName: currentUser.name,
      createdAt: serverTimestamp(),
    })
    setText('')
  }

  const renderItem = ({ item }) => {
    const isMe = item.senderId === currentUid
    const profile = isMe
      ? currentUser
      : senderProfiles[item.senderId] || { name: item.senderName, photoURL: null }

    return (
      <View style={[styles.row, isMe && styles.rowReverse]}>
        <Avatar name={profile.name} photoURL={profile.photoURL} size={34} />
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {!isMe && <Text style={styles.sender}>{profile.name}</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    )
  }

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
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
          onSubmitEditing={handleSend}
          returnKeyType="send"
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
  headerBtn: { fontWeight: 'bold', fontSize: 16 },
  logo: { width: 100, height: 120, alignSelf: 'center' },

  // Message rows
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    gap: 6,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },

  // Bubbles
  bubble: {
    padding: 10,
    borderRadius: 14,
    maxWidth: '70%',
  },
  theirBubble: {
    backgroundColor: '#d6f9df',
    borderBottomLeftRadius: 4,
  },
  myBubble: {
    backgroundColor: '#8dc9a4',
    borderBottomRightRadius: 4,
  },
  sender: { fontWeight: 'bold', marginBottom: 2, fontSize: 12, color: '#333' },
  messageText: { fontSize: 15 },

  // Avatar
  avatar: {
    overflow: 'hidden',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Input
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10 },
  button: { backgroundColor: '#8dc9a4', padding: 10, borderRadius: 5, justifyContent: 'center' },
  buttonText: { fontWeight: 'bold' },
})