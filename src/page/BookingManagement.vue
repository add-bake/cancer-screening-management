<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约</el-breadcrumb-item>
      <el-breadcrumb-item>预约管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar fix">
        筛选查询
        <el-button class="r" @click="getData">查询结果</el-button>
        <el-button type="text" class="r" @click="screenControl">{{screenShow ? '收起' : '展开'}}筛选</el-button>
      </div>
      <el-form :inline="true" :model="screenData" class="demo-form-inline" v-show="screenShow">
        <el-form-item label="姓名：">
          <el-input v-model="screenData.userName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="分享者：">
          <el-input v-model="screenData.shareName" placeholder="分享者"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="title-bar fix">
        数据列表
        <el-button class="r">导出信息</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="80"
          :formatter="sexHandle">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="appointmentDate"
          label="预约时间"
          width="165">
        </el-table-column>
        <el-table-column
          prop="checkAmount"
          label="体检费用"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="合作机构"
          width="150">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="150">
        </el-table-column>
        <el-table-column
          prop="shareName"
          label="分享者"
          width="80">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="150"
          :formatter="statusHandle">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="165">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="openDetail(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[30, 50, 100]"
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
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['orderStatus'])
  },
  created() {
    this.getData()
  },
  data() {
    return {
      screenData: {
        userName: '',
        region: '',
      },
      page: {
        pageSize: 30,
        pageNum: 1
      },
      totalPage: 0,
      screenShow: true,
      tableData: [],
      loading: false
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post({
        param: this.screenData,
        page: this.page
      },api.getOrder)
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    sexHandle(val) {
      return val.sex ? '男' : '女'
    },
    statusHandle(val) {
      return this.orderStatus[val.state]
    },
    screenControl() {
      this.screenShow = !this.screenShow
    },
    openDetail(row) {
      this.$message('这是一条消息提示');
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

</style>
