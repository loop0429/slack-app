import {
  Button,
  Center,
  Input,
  Modal,
  PasswordInput,
  Stack,
  UnstyledButton,
} from '@mantine/core'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

import * as types from '../types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
const defaultValue = {
  email: '',
  password: '',
}

export default function IndexPage() {
  const supabase = createClient(url, key)
  const { push } = useRouter()
  const [login, setLogin] = useState<types.LoginUser>({ ...defaultValue })
  const [signUp, setSignUp] = useState<types.LoginUser>({ ...defaultValue })
  const [opened, setOpened] = useState<boolean>(false)

  const updateLoginForm = (value: string, name: string) => {
    setLogin({
      ...login,
      [name]: value,
    })
  }

  const updateSignUpForm = (value: string, name: string) => {
    setSignUp({
      ...signUp,
      [name]: value,
    })
  }

  // ログイン
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: login.email,
      password: login.password,
    })

    if (error) {
      alert(error.message)
      return
    }

    if (data && !error) {
      push('/app/public')
    }
  }

  // サインアップ
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email: signUp.email,
      password: signUp.password,
    })

    if (data && !error) {
      alert('メールを送信したのでご確認ください')
      setOpened(false)
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleLogin(e)}>
        <Center mt={50}>
          <Stack w={350}>
            <Input.Wrapper label="Email">
              <Input
                onChange={(e: any) => {
                  updateLoginForm(e.target.value, 'email')
                }}
              />
            </Input.Wrapper>
            <PasswordInput
              label="Password"
              onChange={(e) => {
                updateLoginForm(e.target.value, 'password')
              }}
            />
            <Button type="submit">ログイン</Button>
            <UnstyledButton
              c="blue"
              ta="center"
              onClick={() => setOpened(true)}
            >
              アカウントを作成する
            </UnstyledButton>
          </Stack>
        </Center>
      </form>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="新規アカウント作成"
      >
        <form onSubmit={(e) => handleSignUp(e)}>
          <Stack>
            <Input.Wrapper label="Email">
              <Input
                onChange={(e: any) => {
                  updateSignUpForm(e.target.value, 'email')
                }}
              />
            </Input.Wrapper>
            <PasswordInput
              label="Password"
              onChange={(e) => {
                updateSignUpForm(e.target.value, 'password')
              }}
            />
            <Button type="submit">アカウント作成</Button>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
