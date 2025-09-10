import { Route, Routes, Navigate } from 'react-router-dom'

import ChatContainer from '@/pages/chats/chatsContainer'
import ChatsIndex from '@/pages/chats/chatIndex'
import Chat from '@/pages/chats/chat'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/chats' replace />}/>
      <Route path='/chats' element={ <ChatContainer /> }>
        <Route index element={ <ChatsIndex /> } />
        <Route path=':chatId' element={ <Chat /> } />
      </Route>

      <Route path='*' element={<Navigate to='/chats' replace />} />
    </Routes>
  )
}

export default App
