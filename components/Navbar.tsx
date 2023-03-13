import { Indicator, Navbar, NavLink } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'
import Link from 'next/link'
import * as types from '../types'

type Props = {
  channels: types.Channels[]
  unread: number[]
  slug: string | string[]
  handleNavLinkClick: (slug: string) => void
}

const LayoutNavbar: React.FC<Props> = ({
  channels,
  unread,
  slug,
  handleNavLinkClick,
}) => {
  return (
    <Navbar width={{ base: 150 }}>
      {channels.map((x) => (
        <Link key={x.id} href={`/app/${x.slug}`} passHref>
          <Indicator
            size={9}
            offset={10}
            position="top-start"
            disabled={!unread.includes(x.id)}
          >
            <NavLink
              label={x.slug}
              rightSection={<IconChevronRight size={12} stroke={1.5} />}
              active={x.slug === slug}
              onClick={() => handleNavLinkClick(x.slug)}
            />
          </Indicator>
        </Link>
      ))}
    </Navbar>
  )
}

export default LayoutNavbar
