import { useEffect, useRef, useState, FormEvent, useMemo } from 'react'
import { getSocket } from '@/socketClient'
import { useParams } from 'react-router-dom'
import { Avatar, Button, Card, Divider, Input, User } from '@heroui/react'
import { images } from '@/variables/data'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import { UploadFile } from '@/components/UploadFile'
import { Msg, MessageRowProps } from '@/types'

const seed: Record<string, Msg[]> = {
  '1': [
  ],
}

function handleFileUpload(
  file: File,
  {
    chatId,
    socket,
    setMsgs,
  }: {
    chatId: string
    socket: ReturnType<typeof getSocket>
    setMsgs: React.Dispatch<React.SetStateAction<Msg[]>>
  }
) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const tempId = crypto.randomUUID()

  const messageText = `📎 Archivo subido: ${file.name} (${Math.round(file.size / 1024)} KB)`

  const newMsg: Msg = {
    id: tempId,
    from: 'admin',
    text: messageText,
    at: now,
  }

  setMsgs((prev) => [...prev, newMsg])

  socket.emit(
    'message:send',
    { room: chatId, text: messageText, at: now },
    (confirmation: { ok: boolean; id?: string }) => {
      if (confirmation?.ok) {
        setMsgs((msgs) =>
          msgs.map((m) => (m.id === tempId ? { ...m, id: confirmation.id! } : m))
        )
      }
    }
  )
}

function MessageRow({ msg, isMine, showAvatar }: MessageRowProps) {
  const base = 'px-4 py-2 text-sm max-w-[75%] shadow-sm leading-snug'
  const mine = 'bg-indigo-500 text-white rounded-2xl'
  const theirs = 'bg-slate-700 text-slate-100 rounded-2xl'

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start' } items-end gap-2`}>
      {
        (!isMine && showAvatar) && (
          <Avatar
            radius='full'
            size='sm'
            src={ images.diabal }
            className='self-end min-w-8'
          />
        )
      }

      <Card className={`${base} ${isMine ? mine : theirs}`}> { msg.text } </Card>
    </div>
  )
}

export default function ChatView() {
  const { chatId = '1' } = useParams()
  const [messages, setMsgs] = useState<Msg[]>(seed[chatId] ?? [])
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const socket = useMemo(() => getSocket({ userId: 'admin-1', name: 'Admin' }), [])

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages])
  useEffect(() => {
    const onServerMessage = (msg: Msg) => {
      setMsgs(messages => (messages.some(({ id }) => id === msg.id) ? messages : [...messages, msg]))
    }

    socket.emit('room:join', { room: chatId })
    socket.on('message:new', onServerMessage)

    return () => {
      socket.emit('room:leave', { room: chatId })
      socket.off('message:new', onServerMessage)
    }
  }, [socket, chatId])

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()

    setText(text.trim())

    if (!text) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const tempId = crypto.randomUUID()
  
    setMsgs((p) => [...p, { id: tempId, from: 'admin', text, at: now }])
    setText('')

    socket.emit(
      'message:send',
      { room: chatId, text, at: now },
      (confirmation: { ok: boolean, id?: string, error?: string }) => {
        if (!confirmation?.ok) {
          setMsgs((messages: Msg[]) =>
            messages.map(element =>
              element.id === tempId ? { ...element, text: `${element.text} (no enviado)` } : element
            )
          )
          return
        }

        setMsgs((messages: Msg[]) => {
          const serverId = confirmation.id!
          const already = messages.some(({ id }) => id === serverId)

          if (already) return messages.filter(({ id }) => id !== tempId)

          return messages.map(element => {
              return (element.id === tempId ? { ...element, id: serverId } : element)
            })
        })
      }
    )
  }

  return (
    <div className='h-full w-full flex flex-col'>
      <Card className='flex flex-col bg-slate-800/70 m-3 h-full'>
        <div className='flex items-center gap-3 px-4 py-3 w-full '>
          <User
            className='font-semibold'
            name='Diabal'
            description='Agent'
            avatarProps={{ src: images.diabal }}
          />
        </div>

        <Divider />

        <div className='flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2'>
          {
            messages.map((message) => {
              return (
                <MessageRow
                  key={message.id}
                  msg={message}
                  isMine={message.from === 'admin'}
                  showAvatar={message.from === 'bot'}
                />
              )
            })
          }

          <div ref={bottomRef} />
        </div>

        <Divider />

        <form onSubmit={sendMessage} className='p-3'>
          <UploadFile  onFileUpload={(file) => handleFileUpload(file, { chatId, socket, setMsgs })}/>

          <div className='flex items-center gap-2 rounded-2xl bg-gray-100/10 px-3 mt-3 py-2'>
            <Input
              variant='flat'
              radius='lg'
              value={text}
              onChange={(e) => setText(e.target.value)}
              classNames={{
                inputWrapper: 'bg-transparent shadow-none',
                input: 'text-slate-200 placeholder:text-slate-400',
              }}
              placeholder='Send a message...'
            />

            <Button
              type='submit'
              radius='full'
              size='sm'
              color='primary'
              isDisabled={!text.trim()}
              isIconOnly 
            >
              <ArrowUpIcon className='h-5 w-5'/>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
