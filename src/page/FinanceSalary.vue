<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务</el-breadcrumb-item>
      <el-breadcrumb-item>佣金发放</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar">筛选查询</div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" @submit.native.prevent @keydown.native.enter="screenSubmit">
        <el-form-item label="姓名：">
          <el-input v-model="screenData.nickName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="screenSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="title-bar fix">
        数据列表
        <el-button class="r" @click="exportData">导出信息</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column
          prop="nickName"
          label="姓名"
          width="130">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="佣金金额"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="bankName"
          label="银行"
          width="150">
        </el-table-column>
        <el-table-column
          prop="bankCard"
          label="银行卡号">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="$router.push(`/finance/salary/${scope.row.userId}`)" type="text" size="small">查看详情</el-button>
          </template>
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
    </div>
    <transition name="fade">
      <router-view class="detail-view"></router-view>
    </transition>
  </div>
</template>

<script>
import http from '../utils/http.js'
import api from '../utils/api.js'
import dayjs from 'dayjs'

export default {
  created() {
    this.getData()
  },
  data() {
    return {
      screenData: {
        nickName: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      totalPage: 0,
      tableData: [],
      loading: false,
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post(api.getFinanceBkge, {
        param: this.screenData,
        page: this.page
      })
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    screenSubmit() {
      this.page.pageNum = 1
      this.getData()
    },
    handleSizeChange(arg) {
      this.page.pageSize = arg
      this.getData()
    },
    handleCurrentChange(arg) {
      this.page.pageNum = arg
      this.getData()
    },
    exportData() {
      http.download(`${api.exportFinanceBkge}`,this.screenData)
    }
  }
}
</script>

<style lang="less" scoped>
.table-box {
  position: relative;
  z-index: 0;
}
.detail-view {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
