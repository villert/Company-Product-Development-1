// screens/ChatScreen.js
import React, { memo, useEffect, useState, useRef } from 'react'
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
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const senderCache = {}

const Avatar = memo(function Avatar({ name, photoURL, size = 32 }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (photoURL) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}
      />
    )
  }

  const avatarColors = ['#f28b82', '#fbbc04', '#34a853', '#4285f4', '#a142f4', '#ff6d00', '#00bcd4']
  const colorIndex = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length
    : 0

  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: avatarColors[colorIndex],
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
    }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: size * 0.38 }}>{initials}</Text>
    </View>
  )
})

const MessageRow = memo(function MessageRow({ item, currentUid, currentUser, senderProfiles, colors, guestLabel }) {
  const isMe = item.senderId === currentUid
  const rawProfile = isMe
    ? currentUser
    : senderProfiles[item.senderId] || { name: item.senderName, photoURL: null }
  const displayName =
    rawProfile?.name?.trim() ||
    item.senderName?.trim() ||
    guestLabel
  const profile = { ...rawProfile, name: displayName }

  return (
    <View style={[styles.row, isMe && styles.rowReverse]}>
      <Avatar name={profile.name} photoURL={profile.photoURL} size={34} />
      <View style={[
        styles.bubble,
        { backgroundColor: isMe ? colors.myBubble : colors.theirBubble },
        isMe ? styles.myBubbleRadius : styles.theirBubbleRadius
      ]}>
        {!isMe && <Text style={[styles.sender, { color: colors.subText }]}>{profile.name}</Text>}
        <Text style={[styles.messageText, { color: colors.text }]}>{item.text}</Text>
      </View>
    </View>
  )
})

export default function ChatScreen({ navigation }) {
  const { colors, isDark } = useTheme()
  const {t} = useLanguage()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [currentUser, setCurrentUser] = useState({ name: t('guest'), photoURL: null })
  const [senderProfiles, setSenderProfiles] = useState({})
  const [currentUid, setCurrentUid] = useState(null)
  const flatListRef = useRef(null)

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) return
      setCurrentUid(user.uid)
      if (user.isAnonymous) return
      const docSnap = await getDoc(doc(db, 'users', user.uid))
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrentUser({ name: data.name || '', photoURL: data.photoURL || null })
      }
    })
    return () => unsubscribeAuth()
  }, [t])

  const fetchSenderProfile = async (senderId) => {
    if (senderCache[senderId]) return
    senderCache[senderId] = true
    const docSnap = await getDoc(doc(db, 'users', senderId))
    if (docSnap.exists()) {
      const data = docSnap.data()
      senderCache[senderId] = { name: data.name || '', photoURL: data.photoURL || null }
      setSenderProfiles(prev => ({ ...prev, [senderId]: senderCache[senderId] }))
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'chats', 'general', 'messages'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setMessages(msgs)
      msgs.forEach(msg => {
        if (msg.senderId && !senderCache[msg.senderId]) fetchSenderProfile(msg.senderId)
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

  const ChatHeader = () => (
    <SafeAreaView style={{ backgroundColor: colors.header }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerBtn, { color: colors.headerText }]}>{t('back')}</Text>
        </TouchableOpacity>
        <Image
          source={isDark ? require('../assets/Foodi_logo_white.png') : require('../assets/Foodi_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ width: 60 }} />
      </View>
    </SafeAreaView>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ChatHeader />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageRow
            item={item}
            currentUid={currentUid}
            currentUser={currentUser}
            senderProfiles={senderProfiles}
            colors={colors}
            guestLabel={t('guest')}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
        initialNumToRender={20}
        maxToRenderPerBatch={12}
        windowSize={10}
        removeClippedSubviews
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor={colors.hint}
          value={text}
          onChangeText={setText}
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.myBubble }]} onPress={handleSend}>
          <Text style={[styles.buttonText, { color: colors.headerText }]}>{t('send')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerBtn: { fontWeight: 'bold', fontSize: 16 },
  logo: { width: 100, height: 120, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8, gap: 6 },
  rowReverse: { flexDirection: 'row-reverse' },
  bubble: { padding: 10, borderRadius: 14, maxWidth: '70%' },
  theirBubbleRadius: { borderBottomLeftRadius: 4 },
  myBubbleRadius: { borderBottomRightRadius: 4 },
  sender: { fontWeight: 'bold', marginBottom: 2, fontSize: 12 },
  messageText: { fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1, borderRadius: 5, padding: 10, marginRight: 10 },
  button: { padding: 10, borderRadius: 5, justifyContent: 'center' },
  buttonText: { fontWeight: 'bold' },
})
