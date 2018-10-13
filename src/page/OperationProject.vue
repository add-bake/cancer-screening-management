<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>体检项目</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar fix">
        筛选查询
        <el-button class="r" @click="screenSubmit">查询结果</el-button>
        <el-button type="text" class="r" @click="screenShow = !screenShow">{{screenShow ? '收起' : '展开'}}筛选</el-button>
      </div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" v-show="screenShow" @submit.native.prevent>
        <el-form-item label="项目名称：">
          <el-input v-model="screenData.projectName" placeholder="项目名称"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="title-bar fix">
        数据列表
        <el-button class="r" @click="openDialog">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="项目价格">
        </el-table-column>
        <el-table-column
          prop="projectDescription"
          label="项目描述">
        </el-table-column>
        <el-table-column
          prop="projectCode"
          label="项目编码">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="selfBkge"
          label="个人佣金">
        </el-table-column>
        <el-table-column
          prop="oneBkge"
          label="上级佣金">
        </el-table-column>
        <el-table-column
          prop="orgBkge"
          label="机构佣金">
        </el-table-column>
        <el-table-column
          prop="deviceBkge"
          label="设备佣金">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="110">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <el-button @click="editProject(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="delProject(scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog title="体检项目" width="760px" custom-class="custom-dialog" :visible.sync="customDialogVisible">
      <el-form ref="form" :model="form" label-width="94px" :rules="rules" size="small">
        <el-form-item label="项目名称：" prop="projectName">
          <el-input v-model="form.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目价格：" prop="amount">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="项目描述：" prop="projectDescription">
          <el-input v-model="form.projectDescription"></el-input>
        </el-form-item>
        <el-form-item label="项目编码：" prop="projectCode">
          <el-input v-model="form.projectCode"></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop="orgCode">
          <el-select v-model="form.orgCode" placeholder="请选择机构">
            <el-option v-for="item in orgList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人佣金：" prop="selfBkge">
          <el-input v-model="form.selfBkge"></el-input>
        </el-form-item>
        <el-form-item label="上级佣金：" prop="oneBkge">
          <el-input v-model="form.oneBkge"></el-input>
        </el-form-item>
        <el-form-item label="机构佣金：" prop="orgBkge">
          <el-input v-model="form.orgBkge"></el-input>
        </el-form-item>
        <el-form-item label="设备佣金：" prop="deviceBkge">
          <el-input v-model="form.deviceBkge"></el-input>
        </el-form-item>
        <el-form-item label="封面图：" prop="projectImg">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="项目介绍：" prop="content">
          <quillEditor
            v-model="form.content"
            :options="editorOption">
          </quillEditor>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueQuillEditor, { quillEditor } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import { setTimeout } from 'timers';
window.Quill.register('modules/imageDrop', ImageDrop)
window.Quill.register('modules/imageResize', ImageResize)

export default {
  components: {
    quillEditor
  },
  created() {
    this.uploadAction = `${process.env.API_ROOT}${api.uploadSingle}`
    this.getData()
    this.getOrgList()
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (value) {
        const reg = /^([1-9]\d*|0)(\.\d{1,2})?$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的金额"));
        }
      } else {
        callback();
      }
    }
    return {
      screenData: {
        projectName: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      uploadAction: '', //图片上传地址
      totalPage: 0,
      screenShow: true,
      tableData: [],
      loading: false,
      customDialogVisible: false,
      orgList: [],
      imgUrl: '',
      form: {
        projectName: '',
        amount: '',
        projectDescription: '',
        projectCode: '',
        orgCode: '',
        selfBkge: '',
        oneBkge: '',
        orgBkge: '',
        deviceBkge: '',
        projectImg: '',
        content: ''
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入项目价格', trigger: 'blur' },
          { validator: checkNumber, message: '项目价格必须为数字', trigger: 'blur' },
        ],
        projectDescription: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
        ],
        projectCode: [
          { required: true, message: '请输入项目编码', trigger: 'blur' },
          { max: 32, message: '项目编码最长32个字符', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        selfBkge: [
          { required: true, message: '请输入个人佣金', trigger: 'blur' },
          { validator: checkNumber, message: '个人佣金必须为数字', trigger: 'blur' }
        ],
        oneBkge: [
          { required: true, message: '请输入上级佣金', trigger: 'blur' },
          { validator: checkNumber, message: '上级佣金必须为数字', trigger: 'blur' }
        ],
        orgBkge: [
          { required: true, message: '请输入机构佣金', trigger: 'blur' },
          { validator: checkNumber, message: '机构佣金必须为数字', trigger: 'blur' }
        ],
        deviceBkge: [
          { required: true, message: '请输入设备佣金', trigger: 'blur' },
          { validator: checkNumber, message: '设备佣金必须为数字', trigger: 'blur' }
        ],
        projectImg: [
          { required: true, message: '请上传封面图', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入项目介绍', trigger: 'blur' }
        ]
      },
      editorOption: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large'] }],
            ['bold', 'italic'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          }
        }
      }
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await http.post(api.getOperationProject, {
        param: this.screenData,
        page: this.page
      })
      this.loading = false
      this.tableData = res.data
      this.totalPage = res.page.total
    },
    onSubmit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.$ctloading(async () => {
            let vertify = await http.post(api.validCode, {
              projectCode: this.form.orgCode
            })
            if(vertify.data){
              let res = await http.post(this.form.projectId ? api.projectUpdate : api.projectAdd, this.form)
              if(res.code === 0){
                this.$message.success(this.form.projectId ? '修改成功' : '添加成功');
                this.page.pageNum = 1
                this.customDialogVisible = false
                this.getData()
              } else {
                this.$message.warning(res.msg);
              }
            } else {
              this.$message.warning('项目编码重复，请重新填写');
            }
          });
        } else {
          return false;
        }
      });
    },
    async getOrgList() {
      this.$ctloading(async () => {
        let res = await http.get(api.getOrgList)
        if(res.code === 0){
          this.orgList = res.data
        } else {
          this.$message.warning('合作机构列表获取失败,请重试')
        }
      })
    },
    async editProject(row){
      this.$ctloading(async () => {
        let res = await http.get(`${api.getProjectDetail}/${row.projectId}`)
        if(res.code === 0){
          this.form = res.data
          this.imgUrl = `${process.env.IMG_ROOT}${res.data.projectImg}`
          this.customDialogVisible = true
        } else {
          this.$message.warning('项目内容获取失败,请重试')
        }
      })
    },
    openDialog() {
      this.form = {}
      this.$refs['form'].resetFields()
      this.customDialogVisible = true
    },
    delProject(row) {
      this.$confirm('此操作将删除当前体检项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctloading(async () => {
          let res = await http.post(`${api.delProject}/${row.projectId}`,{})
          if(res.code === 0){
            this.$message.success('删除成功!')
            this.page.pageNum = 1
            this.getData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw)
      this.form['projectImg'] = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = 'image/jpeg|image/png'.indexOf(file.type) >= 0;
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
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

<style lang="less">
.custom-dialog .el-dialog__body {
  padding: 46px 24px;
}
.avatar-uploader {
  margin-bottom: -14px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #00a499;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 247px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 247px;
  height: 120px;
  display: block;
}
.quill-editor:not(.bubble) .ql-container,
.quill-editor:not(.bubble) .ql-container .ql-editor {
  height: 15rem;
  padding-bottom: 1rem;
}
.ql-toolbar.ql-snow {
  height: 44px;
  line-height: initial;
}
</style>
