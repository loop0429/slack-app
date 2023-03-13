import { List } from '@mantine/core'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

type Sample = {
  id: number
  title: string
}

export default function RlsPage() {
  const supabase = createClient(url, key)
  const [sample, setSample] = useState<Sample[]>([])

  const fetchData = async () => {
    const { data } = await supabase.from('rls_sample').select('*')

    if (data) {
      setSample(data)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <List>
      {sample.map((x, i) => (
        <List.Item key={i}>{x.title}</List.Item>
      ))}
    </List>
  )
}
