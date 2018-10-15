<template>
  <div class="booking-management">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>健康知识</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="screen-box">
      <div class="title-bar">筛选查询</div>
      <el-form size="small" :inline="true" :model="screenData" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="标题：">
          <el-input v-model="screenData.projectName" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="screenSubmit">查询</el-button>
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
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="subTitle"
          label="副标题">
        </el-table-column>
        <el-table-column
          prop="readingNum"
          label="阅读数">
        </el-table-column>
        <el-table-column
          prop="showFlag"
          label="是否显示"
          :formatter="showFlagHandle">
        </el-table-column>
        <el-table-column
          prop="seqNum"
          label="排序号">
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
            <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog title="健康知识" width="760px" custom-class="custom-dialog" :visible.sync="customDialogVisible">
      <el-form ref="form" :model="form" label-width="94px" :rules="rules" size="small">
        <el-form-item label="资讯标题：" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="subTitle">
          <el-input v-model="form.subTitle"></el-input>
        </el-form-item>
        <el-form-item label="是否显示：" prop="showFlag">
          <el-radio-group v-model="form.showFlag">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章来源：" prop="source">
          <el-input v-model="form.source"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="seqNum">
          <el-input v-model="form.seqNum"></el-input>
        </el-form-item>
        <el-form-item label="封面图：" prop="coverImgs">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="资讯内容：" prop="content">
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
import session from '../utils/session'
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
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (value) {
        const reg = /^([1-9]\d*|0)?$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的数字"));
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
      uploadHeader: {'Authorization': session('token')},
      totalPage: 0,
      tableData: [],
      loading: false,
      customDialogVisible: false,
      imgUrl: '',
      form: {
        title: '',
        subTitle: '',
        showFlag: '',
        seqNum: '',
        coverImgs: '',
        content: '',
        source: '',
        remark: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入资讯标题', trigger: 'blur' }
        ],
        subTitle: [
          { required: true, message: '请输入资讯副标题', trigger: 'blur' }
        ],
        showFlag: [
          { required: true, message: '请选择是否显示', trigger: 'blur' }
        ],
        seqNum: [
          { required: true, message: '请输入排序号', trigger: 'blur' },
          { validator: checkNumber, message: '排序号必须为数字', trigger: 'blur' }
        ],
        coverImgs: [
          { required: true, message: '请上传封面图', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入资讯内容', trigger: 'blur' }
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
      let res = await http.post(api.getNews, {
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
            let res = await http.post(this.form.newsId ? api.newsUpdate : api.newsAdd, this.form)
            if(res.code === 0){
              this.$message.success(this.form.projectId ? '修改成功' : '添加成功');
              this.page.pageNum = 1
              this.customDialogVisible = false
              this.getData()
            } else {
              this.$message.warning(res.msg);
            }
          })
        } else {
          return false;
        }
      });
    },
    async edit(row){
      this.$ctloading(async () => {
        let res = await http.get(`${api.getNewsDetail}/${row.newsId}`)
        if(res.code === 0){
          this.form = res.data
          this.imgUrl = `${process.env.IMG_ROOT}${res.data.coverImgs}`
          this.customDialogVisible = true
        } else {
          this.$message.warning('资讯内容获取失败,请重试')
        }
      })
    },
    openDialog() {
      if(this.form.newsId){
        this.form = {}
        this.imgUrl = ''
        this.$refs['form'].resetFields()
      }
      this.customDialogVisible = true
    },
    del(row) {
      this.$confirm('此操作将删除当前资讯, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctloading(async () => {
          let res = await http.post(`${api.delNews}/${row.newsId}`,{})
          if(res.code === 0){
            this.$message.success('删除成功!')
            this.page.pageNum = 1
            this.getData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      }).catch(() => {
          console.log('用户取消操作')          
      });
    },
    handleAvatarSuccess(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw)
      this.form['coverImgs'] = res.data
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
    showFlagHandle(val){
      return val.showFlag ? '是' : '否'
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
