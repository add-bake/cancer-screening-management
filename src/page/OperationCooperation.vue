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
        <el-button class="r" @click="openAddDetail">添加</el-button>
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
          prop="orgName"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="address"
          label="体检地址">
        </el-table-column>
        <el-table-column
          prop="linkMan"
          label="联系人"
          width="80"
          :formatter="emptyHandle"
        ></el-table-column>
        <el-table-column
          prop="linkTel"
          label="联系电话"
          width="120"
          :formatter="emptyHandle"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditDetail(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteDetail(scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog title="机构详情" width="760px" custom-class="custom-dialog" :visible.sync="customDialogVisible">
      <el-form ref="form" :model="form" label-width="94px" :rules="rules" size="small">
        <el-form-item label="机构名称：" prop="orgName">
          <el-input v-model="form.orgName"></el-input>
        </el-form-item>
        <el-form-item label="机构编码：" prop="orgCode">
          <el-input v-model="form.orgCode"></el-input>
        </el-form-item>
        <el-form-item label="机构地址：" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkMan">
          <el-input v-model="form.linkMan"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="linkTel">
          <el-input v-model="form.linkTel"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="customDialogVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
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
      currentOrgId: '',
      form: {},
      rules: {
        orgName: [
          {required: true, message: '请输入机构名称', trigger: 'blur'}
        ],
        orgCode: [
          {required: true, message: '请输入机构编码', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '您只能输入数字字母'}
        ],
        address: [
          {required: true, message: '请输入机构地址', trigger: 'blur'},
          {min: '6', message: '请输入至少6个字符', trigger: 'blur'}
        ],
        linkMan: [
          {required: true, message: '请输入联系人姓名', trigger: 'blur'}
        ],
        linkTel: [
          {required: true, message: '请输入联系人手机号', trigger: 'blur'},
          {pattern: /^1[0-9]{10}$/, message: '请输入正确格式的手机号', trigger: 'blur'}
        ]
      }
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
    emptyHandle(row, column) {
      return row[column.property] || '--'
    },
    screenControl() {
      this.screenShow = !this.screenShow
    },
    openAddDetail () {
      this.form = {}
      this.currentOrgId = ''
      this.customDialogVisible = true
    },
    openEditDetail(row) {
      this.currentOrgId = row.orgId
      this.$ctloading(async () => {
        let res = await http.get(`${api.getOrgDetail}/${row.orgId}`)
        this.form = res.data
        this.customDialogVisible = true
      })
    },
    async deleteDetail (row) {
      let res = await http.post(`${api.addOrg}/${row.orgId}`)
      if (res.code === 0) {
        this.$message('机构删除成功')
        this.getData()
      } else {
        this.$message(res.msg)
      }
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.currentOrgId) {
            this.updateDetail()
          } else {
            this.addDetail()
          }
        }
      })
    },
    async addDetail () {
      let res = await http.post(api.addOrg, this.form)
      if (res.code === 0) {
        this.$message('机构添加成功')
        this.customDialogVisible = false
        this.screenSubmit()
      } else {
        this.$message(res.msg)
      }
    },
    async updateDetail () {
      let res = await http.post(api.updateOrg, this.form)
      if (res.code === 0) {
        this.$message('机构更新成功')
        this.customDialogVisible = false
        this.getData()
      } else {
        this.$message(res.msg)
      }
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
