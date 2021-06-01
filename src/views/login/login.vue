<template>
  <div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎登录DATAAI</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" autocomplete="off" v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" autocomplete="off" v-model="form.password"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
        title="温馨提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <span>{{diaMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>

<script>
import * as types from '../../store/types'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      diaMessage: "",
      rules: {
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      token: '',
    }
  },
  mounted() {
    this.$store.commit(types.TITLE, 'Login')
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          let data = {'name': this.form.username, 'password': this.form.password}
          this.axios.post('http://dataai.pro/api/login', data).then((res) => {
            if (res.data.status === 'success') {
              this.$store.commit(types.LOGIN, res.data.data.access_token)
              let redirect = decodeURIComponent(this.$route.query.redirect || '/');
              this.$router.push({path: redirect})
            } else {
              this.dialogVisible = true
              this.diaMessage = res.data.status
            }
          })
        }else{
          this.dialogVisible = true;
          return false;
        }
      })
    },
    handleClose() {
      console.log("close")
    }
  }
}
</script>
