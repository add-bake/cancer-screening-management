<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>合作机构</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar fix">
        筛选查询
        <el-button class="r" @click="screenSubmit">查询结果</el-button>
        <el-button type="text" class="r" @click="screenControl">{{screenShow ? '收起' : '展开'}}筛选</el-button>
      </div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" v-show="screenShow">
        <el-form-item label="机构名称：">
          <el-input v-model="screenData.orgName" placeholder="机构名称"></el-input>
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
        <el-table-column
          fixed
          type="selection"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="50"
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
          width="160"
        ></el-table-column>
        <el-table-column
          prop="checkAmount"
          label="体检费用">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="合作机构">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="shareName"
          label="分享者">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          :formatter="statusHandle">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="openDetail(scope.row)" type="text" size="small">查看详情</el-button>
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
    <!-- 详情弹出框 -->
    <el-dialog title="预约详情" width="760px" custom-class="custom-dialog" :visible.sync="customDialogVisible">
      <div class="detail-item">
        <p class="item-title">预约信息</p>
        <div class="item-info fix">
          <p class="info-title l">预约时间：</p>
          <p class="info-content l" v-html="detailData.appointmentDate"></p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">预约地点：</p>
          <p class="info-content l" v-html="detailData.orgName">111</p>
        </div>
      </div>
      <div class="detail-item">
        <p class="item-title">费用及备注</p>
        <div class="item-info fix">
          <p class="info-title l">体检费用：</p>
          <p class="info-content l">￥{{detailData.checkAmount}}</p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">备注：</p>
          <p class="info-content l" v-html="detailData.remark"></p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">支付状态：</p>
          <p class="info-content l">{{$dict.orderStatus[detailData.state]}}</p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">分享者：</p>
          <p class="info-content l" v-html="detailData.shareName"></p>
        </div>
      </div>
      <div class="detail-item">
        <p class="item-title">体检人信息</p>
        <div class="item-info fix">
          <p class="info-title l">姓名：</p>
          <p class="info-content l" v-html="detailData.name"></p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">性别：</p>
          <p class="info-content l">{{detailData.sex ? '男' : '女'}}</p>
        </div>
        <div class="item-info fix">
          <p class="info-title l">手机号：</p>
          <p class="info-content l" v-html="detailData.phone"></p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../utils/http.js'
import api from '../utils/api.js'

export default {
  created() {
    this.getData()
  },
  data() {
    return {
      screenData: {
        orgName: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      totalPage: 0,
      screenShow: true,
      tableData: [],
      loading: false,
      customDialogVisible: false,
      detailData: {}
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post(api.getOrgPage, {
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
    sexHandle(val) {
      return val.sex ? '男' : '女'
    },
    statusHandle(val) {
      return this.$dict.orderStatus[val.state]
    },
    screenControl() {
      this.screenShow = !this.screenShow
    },
    openDetail(row) {
      this.$ctloading(async () => {
        let res = await http.get(`${api.getBookingOrderDetail}/${row.healthCheckOrderId}`)
        this.detailData = res.data
        this.customDialogVisible = true
      })
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
