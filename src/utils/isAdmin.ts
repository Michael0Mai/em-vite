import { store } from '@/store'

export const isAdmin = () => {
  // console.log(store.state.user.groups[0].name === 'manager')
  if (!store.state.user) {
    return false
  } else {
    if (store.state.user.groups[0].name === 'manager') {
      return true
    } else {
      return false
    }
  }
}
