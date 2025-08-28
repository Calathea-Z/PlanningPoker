import { useEffect, useMemo, useRef } from 'react'
import { getConnection, ensureConnected } from '../realtime'
import { useUI } from '../store'

// Simple flag to prevent duplicate event handler registration
let isInitialized = false

export function useSignalR() {
  const { setRoom } = useUI()
  const conn = useMemo(() => getConnection(''), [])

  useEffect(() => {
    // Only register handlers once
    if (isInitialized) {
      return
    }

    console.log('Setting up SignalR event handlers...')
    
    // Register event handlers
    conn.on('room_state', (state) => {
      console.log('Received room state:', state)
      setRoom(state)
    })

    conn.on('player_joined', () => {
      console.log('Player joined event received')
    })

    conn.on('player_voted', () => {
      console.log('Player voted event received')
    })

    conn.on('issue_attached', (issueKey: string) => {
      console.log('Issue attached:', issueKey)
    })

    conn.on('revealed', (votes: Record<string, number | null>) => {
      console.log('Revealed event received:', votes)
    })

    conn.on('round_reset', () => {
      console.log('Round reset event received')
    })

    isInitialized = true
    ensureConnected().catch(err => console.error('SignalR start failed:', err))
    
    return () => {
      // Only cleanup if this is the last instance
      if (isInitialized) {
        console.log('Cleaning up SignalR event handlers...')
        conn.off('room_state')
        conn.off('player_joined')
        conn.off('player_voted')
        conn.off('issue_attached')
        conn.off('revealed')
        conn.off('round_reset')
        isInitialized = false
      }
    }
  }, [conn, setRoom])

  return conn
}
