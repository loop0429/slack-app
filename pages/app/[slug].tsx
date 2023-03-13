import {
  AppShell,
  Avatar,
  Box,
  Divider,
  Flex,
  LoadingOverlay,
  Text,
} from '@mantine/core'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

import Navbar from '../../components/Navbar'
import Header from '../../components/Header'
import MessageForm from '../../components/MessageForm'

import * as types from '../../types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

export default function AppPage() {
  const supabase = createClient(url, key)
  const { push, query } = useRouter()
  const [visible, setVisible] = useState<boolean>(true)
  const [slug, setSlug] = useState<string | string[]>('')
  const [channelId, setChannelId] = useState<number>(0)
  const [userId, setUserId] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [channels, setChannels] = useState<types.Channels[]>([])
  const [messages, setMessages] = useState<types.Messages[]>([])
  const [message, setMessage] = useState<string>('')
  const [unread, setUnread] = useState<number[]>([])
  const scrollBottomRef = useRef<HTMLDivElement>(null)

  // サインアウト
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      push('/')
    }
  }

  const fetchMessageData = (id: number) => {
    return new Promise(async (resolve) => {
      const messagesData = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', id)
        .select(`
          *,
          user: user_id(
            *
          )
        `)

      if (messagesData.data) {
        setMessages(messagesData.data)
        return resolve('success')
      }
    })
  }

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user!.id)

    const myData = await supabase.from('users').select('*').eq('id', user!.id).single()
    setAvatar(myData.data.avatar_image)
    setUserName(myData.data.display_name)

    const channelsData = await supabase.from('channels').select('*')

    if (channelsData.data) {
      setChannels(channelsData.data)
    }

    const target = channelsData!.data!.find((i) => i.slug === query.slug)
    setChannelId(target!.id)

    await fetchMessageData(target!.id)

    setVisible(false)
  }

  const handleNavLinkClick = async (slug: string) => {
    setVisible(true)

    const target = channels.find((i) => i.slug === slug)
    setChannelId(target!.id)
    await fetchMessageData(target!.id)

    setVisible(false)
  }

  // メッセージの送信
  const handleClickSendMessage = async (e: FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('messages')
      .insert({
        message: message,
        user_id: userId,
        channel_id: channelId,
      })
      .select()

    if (data && !error) {
      setMessage('')
    }
  }

  useLayoutEffect(() => {
    scrollBottomRef?.current?.scrollIntoView()
  })

  useEffect(() => {
    localStorage.setItem('channelId', String(channelId))
  }, [channelId])

  useEffect(() => {
    setUnread((prev) => {
      return prev.filter(x => x !== channelId)
    })
  }, [messages])

  useEffect(() => {
    if (query.slug) {
      setSlug(query.slug)
      fetchData()
    }
  }, [query.slug])

  useEffect(() => {
    // 更新の検知
    supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const { data: { user } } = await supabase.auth.getUser()
        const currentChannelId = Number(localStorage.getItem('channelId')) || undefined

        // メッセージの更新
        if (payload.new.channel_id === currentChannelId) {
          await fetchMessageData(Number(currentChannelId))
        }

        if (payload.new.user_id === user!.id) return

        // 未読の更新
        setUnread((prev) => {
          const ids = [...prev, Number(payload.new.channel_id)]
          return [...new Set(ids)]
        })
      })
      .subscribe()
  }, [])

  return (
    <>
      <LoadingOverlay visible={visible} />
      <AppShell
        padding="md"
        navbar={
          <Navbar
            channels={channels}
            unread={unread}
            slug={slug}
            handleNavLinkClick={handleNavLinkClick}
          />
        }
        header={
          <Header
            avatar={avatar}
            userName={userName}
            handleSignOut={handleSignOut}
          />
        }
      >
        <Box w="100%" pos="relative" sx={{
          height: 'calc(100vh - 82px)',
          overflow: 'hidden',
        }}>
          <Box sx={{
            height: 'calc(100% - 50px)',
            overflowY: 'scroll',
          }}>
            {messages.map(x => {
              if (x.channel_id !== channelId) return

              return(
                <React.Fragment key={x.id}>
                  <Flex gap="xs" my="xs">
                    <Avatar src={x.user.avatar_image} alt={x.user.display_name} radius="xl" />
                    <Box>
                      <Flex align="end">
                        <Text fw="bold">{x.user.display_name}</Text>
                        <Text fz="sm" color="gray" ml="xs">{dayjs(x.inserted_at).format('MM/DD HH:mm')}</Text>
                      </Flex>
                      <Text>{x.message}</Text>
                    </Box>
                  </Flex>
                  <Divider />
                  <div ref={scrollBottomRef} />
                </React.Fragment>
              )}
            )}
          </Box>
          <MessageForm
            handleClickSendMessage={handleClickSendMessage}
            setMessage={setMessage}
            message={message}
          />
        </Box>
      </AppShell>
    </>
  )
}
