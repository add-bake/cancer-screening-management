<template>
  <div class="login">
    <div class="wrap pr">
      <div class="login-box pa">
        <p class="title">健康天眼管理系统</p>
        <div class="form-item user-name">
          <input type="text" placeholder="用户名">
        </div>
        <div class="form-item password">
          <input type="password" placeholder="密码">
        </div>
        <div class="form-item code-box fix">
          <input type="text" placeholder="验证码" class="l">
          <img src="https://via.placeholder.com/200x100" alt="" class="r">
        </div>
        <button class="btn-login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
}
.login {
  width: 100%;
  height: 100%;
  background: #fff url("../assets/login_bg.jpg") center center no-repeat;
  background-size: 1920px 948px;
  .wrap {
    height: 100%;
  }
  .login-box {
    top: 50%;
    right: 71px;
    z-index: 1;
    width: 350px;
    padding: 30px 50px 73px 50px;
    margin-top: -250px;
    background: url("../assets/login_box_bg.png") 0 0 no-repeat;
    background-size: 100% 100%;
    box-shadow: 0 3px 16px rgba(9, 92, 218, .57);
    .title {
      font-size: 36px;
      color: #006c67;
      line-height: 110px;
      text-align: center;
      font-weight: bold;
    }
    .form-item {
      margin-bottom: 21px;
      input {
        box-sizing: border-box;
        display: block;
        width: 100%;
        height: 50px;
        padding: 0 44px 0 18px;
        border: 1px solid #dcdfe5;
        border-radius: 3px;
        font-size: 16px;
        color: #999;
        line-height: 50px;
        background-color: #fff;
      }
      &.user-name input {
        background: #fff url("../assets/icon/icon_account.png") 318px center no-repeat;
      }
      &.password input {
        background: #fff url("../assets/icon/icon_password.png") 320px center no-repeat;
      }
      &.code-box {
        input {
          width: 210px;
        }
        img {
          width: 110px;
          height: 50px;
        }
      }
    }
    .btn-login {
      width: 100%;
      height: 50px;
      margin-top: 49px;
      border: 1px solid #dcdfe5;
      border-radius: 3px;
      font-size: 20px;
      color: #fff;
      line-height: 50px;
      text-align: center;
      background-color: #00a29a;
    }
  }
}
</style>

