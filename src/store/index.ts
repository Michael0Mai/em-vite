import { type } from 'os'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { setItem, getItem } from '@/utils/storange'
import { USER } from '@/utils/constants'
// export interface State {
//     count: number
//     isCollapse: boolean
// }

const state = {
  count: 0,
  isCollapse: false,
  user: getItem(USER),
  token: getItem('token')
  // token: JSON.parse(window.localStorage.getItem('token') || 'null')
}

export type State = typeof state

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

// 创建一个新的 store 实例
export const store = createStore<State>({
  state,
  mutations: {
    setIsCollapse (state, payload) {
      state.isCollapse = payload
    },
    setUser (state, payload) {
      state.user = payload
      setItem(USER, state.user)
    },
    setToken (state, payload) {
      state.token = payload
      setItem('token', state.token)
    }
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}
