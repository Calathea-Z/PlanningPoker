import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
  } from '@microsoft/signalr'
  
  let _conn: HubConnection | null = null
  
  export function getConnection(base = ''): HubConnection {
    if (!_conn) {
      _conn = new HubConnectionBuilder()
        .withUrl(`${base}/hubs/poker`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()
    }
    return _conn
  }
  
  export async function ensureConnected(): Promise<HubConnection> {
    const conn = getConnection('')
    if (conn.state === HubConnectionState.Disconnected) {
      await conn.start()
    }
    return conn
  }
  