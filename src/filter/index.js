// 1.不要限制别人得使用方式
import moment from 'moment'
export function formatTime(value, str) {
  return moment(value).format(str)
}
