import { Box, Button, Grid, Input } from '@mantine/core'
import React, { FormEvent } from 'react'

type Props = {
  handleClickSendMessage: (e: FormEvent) => void
  setMessage: React.Dispatch<React.SetStateAction<string>>
  message: string
}

const MessageForm: React.FC<Props> = ({
  handleClickSendMessage,
  setMessage,
  message,
}) => {
  return (
    <Box pos="absolute" w="100%" h={50} sx={{ bottom: 0 }}>
      <form onSubmit={(e) => handleClickSendMessage(e)}>
        <Grid>
          <Grid.Col span={10}>
            <Input
              onChange={(e: any) => setMessage(e.target.value)}
              value={message}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button type="submit" fullWidth>
              送信
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  )
}

export default MessageForm
