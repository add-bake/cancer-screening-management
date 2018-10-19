<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务</el-breadcrumb-item>
      <el-breadcrumb-item>财务结算</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar">筛选查询</div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" @keydown.native.enter="screenSubmit">
        <el-form-item label="合作结构：">
          <el-input v-model="screenData.orgName" placeholder="合作结构"></el-input>
        </el-form-item>
        <el-form-item label="预约时间：">
          <el-date-picker
            v-model="screenData.thisMonth"
            value-format="yyyyMM"
            type="month"
            placeholder="预约时间">
          </el-date-picker>
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
          prop="orgName"
          label="合作机构">
        </el-table-column>
        <el-table-column
          prop="thisMonth"
          label="预约时间">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="总体检费用"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="orgBkge"
          label="合作机构结算金额">
        </el-table-column>
        <el-table-column
          prop="deviceBkge"
          label="设备方结算金额">
        </el-table-column>
        <el-table-column
          prop="selfBkge"
          label="分享者结算金额">
        </el-table-column>
        <el-table-column
          prop="oneBkge"
          label="分享者上级结算金额">
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
        orgName: '',
        thisMonth: '',
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
      let res = await http.post(api.getFinanceSettlement, {
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
      http.download(`${api.exportFinanceSettlement}`,this.screenData)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
