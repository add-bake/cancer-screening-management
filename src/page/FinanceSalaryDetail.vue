<template>
  <div style="padding: 20px; background-color: #f0f3f5">
    <div class="booking-management">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>财务</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/finance/salary' }">佣金发放</el-breadcrumb-item>
        <el-breadcrumb-item>发放详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="screen-box">
        <div class="title-bar">筛选查询</div>
        <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline">
          <el-form-item label="发放时间：">
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
          <el-button class="r">导出信息</el-button>
        </div>
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
        >
          <!-- <el-table-column
            fixed
            type="selection"
          ></el-table-column> -->
          <el-table-column
            prop="name"
            label="体检者姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="体检机构">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="体检费用"
            width="110"
            :formatter="moneyHandle('amount')"
          ></el-table-column>
          <el-table-column
            prop="bkgeAmount"
            label="分佣金额"
            :formatter="moneyHandle('bkgeAmount')"
          ></el-table-column>
          <el-table-column
            prop="bkgeLevel"
            label="分佣类型"
            :formatter="bkgeType"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="体检者电话"
          ></el-table-column>
          <el-table-column
            prop="appointmentDate"
            label="体检时间"
          ></el-table-column>
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
  props: {
    userId: String
  },
  data() {
    return {
      screenData: {
        eTime: '',
        sTime: '',
        userId: this.userId
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
    moneyHandle (key) {
      return (row) => row[key] + '元'
    },
    bkgeType (row) {
      return row.bkgeType === 1 ? '直接分佣' : '间接分佣'
    },
    async getData() {
      this.loading = true
      let res = await http.post(api.getFinanceBkgeDetail, {
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
