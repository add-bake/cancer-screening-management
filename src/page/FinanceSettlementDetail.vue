<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务</el-breadcrumb-item>
      <el-breadcrumb-item>结算明细</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar">筛选查询</div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" @keydown.native.enter="screenSubmit">
        <el-form-item label="合作结构：">
          <el-input v-model="screenData.orgName" placeholder="合作结构"></el-input>
        </el-form-item>
        <el-form-item label="预约时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
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
          prop="appointmentDate"
          label="预约时间"
          width="110">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="体检费用"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="payMode"
          label="支付方式">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="120">
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
        sTime: '',
        eTime: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      dateRange: '',
      totalPage: 0,
      tableData: [],
      loading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  watch: {
    'dateRange'(val){
      if(val){
        this.screenData['sTime'] = dayjs(val[0]).format('YYYY-MM-DD')
        this.screenData['eTime'] = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.screenData['sTime'] = ''
        this.screenData['eTime'] = ''
      }
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post(api.getFinanceSettlementDetail, {
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
      http.download(`${api.exportSettleDetail}`,this.screenData)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
