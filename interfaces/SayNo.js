import type { SayNoCause, SayNoCauseInfo } from '../universal/monopoly/sayNoCauses'

type SayNo = {
  fromUser: Username,
  toUser: Username,
  gameId: string,
  cause: SayNoCause,
  causeInfo: SayNoCauseInfo
}
