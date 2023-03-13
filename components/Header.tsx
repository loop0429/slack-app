import { Avatar, Flex, Header, Menu, Title } from '@mantine/core'

type Props = {
  avatar: string
  userName: string
  handleSignOut: () => void
}

const LayoutHeader: React.FC<Props> = ({ avatar, userName, handleSignOut }) => {
  return (
    <Header height={60} px="xs">
      <Flex align="center" justify="space-between" w="100%" h="100%">
        <Title size="h2">ドッヂボール作戦会議</Title>
        <Menu trigger="hover" shadow="md" width={200}>
          <Menu.Target>
            <Avatar src={avatar} alt={userName} radius="xl" />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{userName}</Menu.Label>
            <Menu.Item onClick={() => handleSignOut()}>サインアウト</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Header>
  )
}

export default LayoutHeader
