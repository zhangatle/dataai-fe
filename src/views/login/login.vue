<template>
  <div>
    <div class="login-wrap" v-show="showLogin">
      <h3>登录</h3>
      <p v-show="showTishi">{{ tishi }}</p>
      <input type="text" placeholder="请输入用户名" v-model="username">
      <input type="password" placeholder="请输入密码" v-model="password">
      <button v-on:click="login">登录</button>
    </div>
  </div>
</template>

<style>
.login-wrap {
  text-align: center;
}

input {
  display: block;
  width: 250px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto 10px;
  outline: none;
  border: 1px solid #888;
  padding: 10px;
  box-sizing: border-box;
}

p {
  color: red;
}

button {
  display: block;
  width: 250px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto 5px;
  border: none;
  background-color: #41b883;
  color: #fff;
  font-size: 16px;
}

span {
  cursor: pointer;
}

span:hover {
  color: #41b883;
}
</style>

<script>
import * as types from '../../store/types'
export default {
  data() {
    return {
      username: '',
      password: '',
      token: '',
      newUsername: '',
      newPassword: '',
      tishi: '',
      showTishi: false,
      showLogin: true,
      showRegister: false
    }
  },
  mounted() {
    this.$store.commit(types.TITLE, 'Login')
  },
  methods: {
    login() {
      if (this.username === "" || this.password === "") {
        alert("请输入用户名或密码")
      } else {
        let data = {'name': this.username, 'password': this.password}
        this.axios.post('http://dataai.pro/api/login', data).then((res) => {
          console.log(res.data)
          if(res.data.status === 'success') {
            this.tishi = "登录成功"
            this.showTishi = true
            setTimeout(function () {
              this.$store.commit(types.LOGIN, res.data.data.access_token)
              let redirect = decodeURIComponent(this.$route.query.redirect || '/');
              this.$router.push({path: redirect})
            }.bind(this), 500)
          }else{
            this.tishi = res.data.status
            this.showTishi = true
          }
        })
      }
    }
  }
}
</script>
