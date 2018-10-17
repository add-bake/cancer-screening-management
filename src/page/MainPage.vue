<template>
  <el-container class="main-page" ref="mainPage" :style="{height: clientHeight+'px'}">
    <el-aside class="menu" style="width: 220px;">
      <p class="system-name l" @click="toIndex">健康天眼管理系统</p>
      <el-scrollbar
        :native="false"
        view-class="view-box"
        class="scroll-box"
      >
        <el-menu router :default-active="currentPage" ref="menu">
          <el-submenu index="1">
            <template slot="title"><i class="menu-icon icon01"></i>预约</template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/booking/management">· 预约管理</el-menu-item>
              <el-menu-item index="/booking/report">· 体检报告</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="menu-icon icon02"></i>运营</template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/operation/project">· 体检项目</el-menu-item>
              <el-menu-item index="/operation/knowledge">· 健康知识</el-menu-item>
              <!-- <el-menu-item index="/operation/insurance">· 癌症保险</el-menu-item> -->
              <!-- <el-menu-item index="/operation/customer">· 客户管理</el-menu-item> -->
              <!-- <el-menu-item index="/operation/help">· 帮助中心</el-menu-item> -->
              <el-menu-item index="/operation/cooperation">· 合作机构</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="menu-icon icon03"></i>财务</template>
            <el-menu-item-group>
              <el-menu-item index="/finance/settlement">· 财务结算</el-menu-item>
              <el-menu-item index="/finance/settlement_detail">· 结算明细</el-menu-item>
              <el-menu-item index="/finance/salary">· 佣金发放</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="menu-icon icon04"></i>系统</template>
            <el-menu-item-group>
              <el-menu-item index="/system/user">· 用户管理</el-menu-item>
              <!-- <el-menu-item index="/system/character">· 角色管理</el-menu-item> -->
              <!-- <el-menu-item index="/system/dict">· 数据字典</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="fix">
        <p class="login-info l">上次登录时间：{{logintime}}</p>
        <div class="tool-box r">
          <!-- <el-badge :value="200" :max="99" class="item">
            <button class="btn-message"></button>
          </el-badge> -->
          <p class="info l">欢迎您，{{username}}</p>
          <button class="head l" @click="toUserIndex">
            <icon-svg icon-class="head"></icon-svg>
          </button>
          <button class="btn-logout l" @click="logout"></button>
        </div>
      </el-header>

      <el-scrollbar
        :native="false"
        view-class="view-box"
        class="main-box"
      >
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script>
import session from '../utils/session'

export default {
  created() {
    this.currentPage = this.$route.fullPath
  },
  data() {
    return {
      currentPage: '', //当前页面路由
      clientHeight: '',
      role: session('role'),
      username: session('username'),
      logintime: session('logintime')
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
      this.$refs.mainPage.style.height = clientHeight+'px';
    },
    logout() {
      this.$confirm('您将退出登录, 是否继续?', '提示', {
        confirmButtonText: '退出登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        session('token', null)
        this.$router.replace('/login')
      })
    },
    toIndex() {
      this.menuClose()
      this.$router.push({path: '/'})
    },
    toUserIndex(){
      this.menuClose()
      this.$router.push({path: '/user/index'})
    },
    menuClose() {
      Object.keys(this.$refs.menu.submenus).map(item => {
        this.$refs.menu.close(item)
      })
    }
  }
}
</script>

<style lang="less">
.main-page {
  height: 500px;
  .menu {
    .system-name {
      width: 100%;
      height: 60px;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 60px;
      text-align: center;
      background-color: #00a499;
      cursor: pointer;
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
      top: 40px;
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
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
/* hack to remove the horizontal scrollbar */
.scroll-box .el-scrollbar__wrap, .main-box .el-scrollbar__wrap {
  overflow-x: auto;
}
</style>

<style scoped>
.scroll-box, .main-box {
  height: calc(100vh - 60px);
  width: 100%;
}
.main-box {
  background-color: #f0f3f5;
}
.scroll-box {
  background: linear-gradient(#1ebdb4, #887df2);
}
</style>

