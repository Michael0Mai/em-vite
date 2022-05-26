<template>
  <div class="login-container">
    <meta name="referrer" content="no-referrer" />
    <el-form
      class="login-form"
      :rules="rules"
      ref="form"
      :model="user"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <div class="login-form__header">
        <img
          class="login-logo"
          src="https://wx2.sinaimg.cn/large/9bba362agy1h1so4ckivaj23402c0kjm.jpg"
          alt="设备管理"
        >
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="user.username"
          placeholder="请输入用户名"
        >
          <template #prefix>
            <el-icon><user-filled /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="user.password"
          type="password"
          placeholder="请输入密码"
        >
          <template #prefix>
            <el-icon><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-button"
          type="primary"
          :loading="loading"
          native-type="submit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/api/common'
import { getUserData } from '@/api/user'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { store } from '@/store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const form = ref<IElForm | null>(null)
const user = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const rules = ref<IFormRule>({
  username: [
    { required: true, message: '请输入账号', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' }
  ]
})

const handleSubmit = async () => {
  const valid = await form.value?.validate() // 表单验证
  if (!valid) {
    return false
  }

  loading.value = true // 验证通过，展示 loading

  const data = await login(user).finally(() => { // 提交
    loading.value = false
  })

  if (!data) return
  // console.log(data.data)
  store.commit('setToken', { // 存储登录用户Token
    ...data.data
  })
  loading.value = true
  getUserData().then(userdata => {
    // console.log(userdata.results[0])
    store.commit('setUser', { // 存储登录用户信息
      ...userdata.results[0]
    })
  })

  ElMessage.success('登录成功')
  // store.commit('setMenus', data.menus)

  // 跳转回原来页面
  let redirect = route.query.redirect
  if (typeof redirect !== 'string') {
    redirect = '/'
  }
  router.replace(redirect).finally(() => {
    loading.value = false
  })
}

</script>

<style lang="scss">

@media screen and (orientation: landscape) {
  .login-container {
    min-width: 400px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: #2d3a4b;
    background-image: url("http://www.uux.cn/attachments/2009/12/1_200912062044441rp1P.jpg");
    background-size:100% 100%;
  }

  .login-form {
    padding: 30px;
    border-radius: 6px;
    background: #fff;
    min-width: 350px;
    .login-form__header {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 30px;
    }

    .el-form-item:last-child {
      margin-bottom: 0;
    }

    .login__form-title {
      display: flex;
      justify-content: center;
      color: #fff;
    }

    .submit-button {
      width: 100%;
    }

    .login-logo {
      width: 271px;
      height: 230px;
    }
    .imgcode-wrap {
      display: flex;
      align-items: center;
      .imgcode {
        height: 37px;
      }
    }
  }
}

@media screen and (orientation: portrait) {

  #app{
    min-width: 100%;
    min-height: 1000px;
  }

  .login-container {
    min-height: 1000px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2d3a4b;
    // background-image: url("http://www.uux.cn/attachments/2009/12/1_200912062044441rp1P.jpg");
    background-size:100% 100%;
  }
.login-form {
    padding: 10px;
    border-radius: 3px;
    background: #fff;
    min-width: 300px;
    min-height: 420px;
    .login-form__header {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 30px;
    }

    .el-form-item:last-child {
      margin-bottom: 0;
    }

    .login__form-title {
      display: flex;
      justify-content: center;
      color: #fff;
    }

    .submit-button {
      width: 100%;
    }

    .login-logo {
      width: 100%;
      height: 230px;
    }
  }
}
</style>
