import { EventEmitter } from 'stream'

const events = {
  notifications: new EventEmitter(),
}

export default events
