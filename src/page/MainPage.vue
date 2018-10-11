<template>
  <el-container class="main-page" ref="mainPage" :style="{height: clientHeight+'px'}">
    <el-aside class="menu" style="width: 220px;">
      <p class="system-name l">健康天眼管理系统</p>
      <el-menu router>
        <el-submenu index="1">
          <template slot="title"><i class="menu-icon icon01"></i>预约</template>
          <el-menu-item-group>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="/booking/management">· 预约管理</el-menu-item>
            <el-menu-item index="1-2">· 体检报告</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="menu-icon icon02"></i>运营</template>
          <el-menu-item-group>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="2-1">· 体检项目</el-menu-item>
            <el-menu-item index="2-2">· 健康知识</el-menu-item>
            <el-menu-item index="2-3">· 癌症保险</el-menu-item>
            <el-menu-item index="2-4">· 客户管理</el-menu-item>
            <el-menu-item index="2-5">· 帮助中心</el-menu-item>
            <el-menu-item index="2-6">· 合作机构</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="menu-icon icon03"></i>财务</template>
          <el-menu-item-group>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="3-1">· 佣金发放</el-menu-item>
            <el-menu-item index="3-2">· 财务结算</el-menu-item>
            <el-menu-item index="3-3">· 结算明细</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="menu-icon icon04"></i>系统</template>
          <el-menu-item-group>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="4-1">· 用户管理</el-menu-item>
            <el-menu-item index="4-2">· 角色管理</el-menu-item>
            <el-menu-item index="4-3">· 数据字典</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="fix">
        <p class="login-info l">这是您第 23323 次登录，上次登录日期：2018：05：20 08：39</p>
        <div class="tool-box r">
          <el-badge :value="200" :max="99" class="item">
            <button class="btn-message"></button>
          </el-badge>
          <p class="info l">欢迎您，admin</p>
          <img class="head l" src="https://via.placeholder.com/100x100" alt="">
          <button class="btn-logout l"></button>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      tableData: Array(20).fill(item),
      clientHeight: ''
    }
  },
  mounted(){
    this.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`
    }
  },
  methods:{
    changeFixed(clientHeight){
      console.log(clientHeight);
      this.$refs.mainPage.style.height = clientHeight+'px';

    },
  }
}
</script>

<style lang="less">
.main-page {
  height: 500px;
  .menu {
    background: linear-gradient(#1ebdb4, #887df2);
    .system-name {
      width: 100%;
      height: 60px;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 60px;
      text-align: center;
      background-color: #00a499;
    }
    .menu-icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 14px;
      vertical-align: middle;
      &.icon01 {
        background: url("../assets/svg/icon_menu01.svg") center 5px no-repeat;
        background-size: 16px;
      }
      &.icon02 {
        background: url("../assets/svg/icon_menu02.svg") center 6px no-repeat;
        background-size: 15px;
      }
      &.icon03 {
        background: url("../assets/svg/icon_menu03.svg") center 5px no-repeat;
        background-size: 18px;
      }
      &.icon04 {
        background: url("../assets/svg/icon_menu04.svg") center 7px no-repeat;
        background-size: 16px;
      }
    }
    .el-menu[role="menubar"] {
      top: 60px;
      padding-top: 20px;
      border: none;
      .el-submenu__title {
        height: 60px;
        color: #fff;
        line-height: 60px;
        overflow: hidden;
        i {
          color: #fff;
        }
        &:hover {
          background-color: rgba(255, 255, 255, .2);
        }
      }
    }
    .el-menu[role="menu"] {
      .el-menu-item-group__title {
        padding: 0;
      }
      .el-menu-item {
        height: 60px;
        padding-left: 64px!important;
        line-height: 60px;
        color: #fff;
        &:hover,
        &.is-active {
          background-color: rgba(255, 255, 255, .2);
        }
      }
    }
    .el-dropdown-menu__item--divided:before, .el-menu, .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover{
      background-color: transparent;
    }
  }
  .el-header {
    height: 60px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
    font-size: 14px;
    color: #999;
    line-height: 60px;
    background-color: #fff;
    .tool-box {
      .el-badge {
        float: left;
        width: 29px;
        height: 30px;
        margin-top: 19px;
        margin-right: 35px;
      }
      button {
        height: 60px;
        border: none;
        &.btn-message {
          display: block;
          width: 36px;
          height: 20px;
          background: url("../assets/svg/icon_message.svg") center center no-repeat;
          background-size: 18px;
        }
        &.btn-logout {
          width: 44px;
          background: url("../assets/svg/icon_logout.svg") center center no-repeat;
          background-size: 17px;
        }
      }
      .info {
        color: #333;
      }
      .head {
        width: 36px;
        height: 36px;
        margin: 12px 22px;
        border-radius: 50%;
      }
    }
  }
  .el-main {
    background-color: #f0f3f5;
  }
}
</style>
