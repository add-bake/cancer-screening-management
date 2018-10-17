<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content fix">
      <div class="user-info l">
        <div class="rect-100 pr">
          <div class="info-content pa">
            <icon-svg class="head-img" icon-class="head"></icon-svg>
            <p class="user-name tc el">{{username}}</p>
            <p class="login-info tc el">上次登录：{{logintime}}</p>
          </div>
        </div>
      </div>
      <div class="table-box r">
        <el-tabs v-model="activeName">
          <el-tab-pane label="修改密码" name="first">待开发</el-tab-pane>
          <el-tab-pane label="操作日志" name="second">
            <el-table
              :data="tableData"
              v-loading="loading"
              style="width: 100%"
            >
              <el-table-column
                prop="createTime"
                label="时间">
              </el-table-column>
              <el-table-column
                prop="operateIpAddr"
                label="IP">
              </el-table-column>
              <el-table-column
                prop="operateRegionCode"
                label="地区">
              </el-table-column>
              <el-table-column
                prop="logName"
                label="操作">
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.pageNum"
              :page-sizes="[10, 15, 20]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalPage">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../utils/http'
import api from '../utils/api'
import session from '../utils/session'

export default {
  created() {
    this.getData()
  },
  data() {
    return {
      activeName: 'second',
      screenData: {
        logName: '',
        ip: '',
        addr: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      username: session('username'),
      logintime: session('logintime'),
      totalPage: 0,
      tableData: [],
      loading: false
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post(api.getLogPage, {
        param: this.screenData,
        page: this.page
      })
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    handleSizeChange(arg) {
      this.page.pageSize = arg
      this.getData()
    },
    handleCurrentChange(arg) {
      this.page.pageNum = arg
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  margin-top: 18px;
  .user-info {
    box-sizing: border-box;
    width: 27.3%;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
    .rect-100 {
      padding-bottom: 100%;
    }
    .info-content {
      top: 18%;
      left: 0;
      right: 0;
    }
    .head-img {
      width: 100px;
      height: 100px;
      display: block;
      margin: 0 auto;
    }
    .user-name {
      margin-top: 34px;
      font-size: 16px;
      color: #2e2e2e;
      line-height: 24px;
    }
    .login-info {
      margin-top: 15px;
      font-size: 14px;
      color: #7a7a7a;
      line-height: 24px;
    }
  }
  .table-box {
    box-sizing: border-box;
    width: 70.5%;
    margin: 0;
  }
}
</style>
<style lang="less">
.el-main {
  min-width: 1000px;
}
.el-tabs__item:hover,
.el-tabs__item.is-active {
  color: #00a499;
}
.el-tabs__active-bar {
  background-color: #00a499;
}
</style>
