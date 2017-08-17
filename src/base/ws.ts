import * as Websocket from 'ws'
import {host, port} from '../config'

const ws = new WebSocket(`ws://${host}/ws:${port}`)

export default ws
