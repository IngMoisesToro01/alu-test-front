import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Listbox,
  ListboxItem,
  User
} from '@heroui/react'
import { images } from '@/variables/data'

function ChatsList() {
  const navigate = useNavigate()
  const { chatId } = useParams()
  const selected = chatId ? new Set([chatId]) : new Set<string>()

  return (
    <Card className='w-62 p-3 m-3 bg-slate-800/70 text-white'>
      <CardHeader className='flex flex-col items-start p-1'>
        <span className='text-lg text-left font-semibold my-2'>Chats</span>
      </CardHeader>

      <Divider />

      <CardBody className='dark:border-default-100 p-0'>
        <Listbox
          className='w-full'
          aria-label='Actions'
          onAction={(key) => navigate(`/chats/${key}`)}
          selectedKeys={selected}
        >
          <ListboxItem key='1' textValue="Diabal Agent">
            <User
              className='font-semibold'
              name='Diabal'
              description='Agent'
              avatarProps={{ src: images.diabal }}
            />
          </ListboxItem>
        </Listbox>
      </CardBody>

      <Divider />

      <CardFooter className='text-xs font-semibold text-center'>
        Made by Eng. Tony
      </CardFooter>
    </Card>
  )
}

function chatsContainer() {
  return (
    <div className='h-screen flex'>
      <ChatsList/>

      <Divider orientation='vertical' />

      <main className='flex-1 min-w-0 min-h-dvh flex'>
        <div className="flex-1 min-w-0 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default chatsContainer
