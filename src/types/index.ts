import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
}

export type Sender = 'admin' | 'bot'

export type Msg = {
  id: string; from:
  Sender;
  text: string;
  at: string
}

export type MessageRowProps = {
  msg: Msg
  isMine: boolean
  showAvatar: boolean
}

export type AuthPayload = { userId?: string, name?: string }


