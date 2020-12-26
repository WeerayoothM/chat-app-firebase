import React, { useState, useRef } from 'react'
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyBtGezh7G8FiSxcwsmQjky4Tgzdi7AOCMc",
  authDomain: "chatapp-3b4c1.firebaseapp.com",
  projectId: "chatapp-3b4c1",
  storageBucket: "chatapp-3b4c1.appspot.com",
  messagingSenderId: "1053568146710",
  appId: "1:1053568146710:web:f4e1f73c4243f80a01c437",
  measurementId: "G-H122SS7G26"
})

const auth = firebase.auth()
const firestore = firebase.firestore()


function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        {/* <SignOut />Y */}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

const SignOut = () => {
  return (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

const ChatRoom = () => {

  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
        <SignOut />
      </form>
    </>
  )
}

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  )
}

export default App;
