export default {
  login: '/auth/login',
  getCodeImg: '/auth/imgPath',
  getBookingOrder: '/api/check/order/page', //分页查询预约信息
  getBookingOrderDetail: '/api/check/order', //查看体检预约详情
  exportCheckOrder: '/report/check/order/export', //预约信息导出
  getMedicalReport: '/api/check/presentation/page', //分页查询体检报告
  getMedicalReportDetail: '/api/check/presentation', //查看体检报告详情
  exportCheckPresentation: '/report/presentation/export', //体检报告导出
  uploadSingle: '/api/upload/single', //单文件上传
  reportCommit: '/api/check/presentation/commit', //体检报告提交
  getOperationProject: '/api/project/page', //分页查询体检项目列表
  getProjectDetail: '/api/project', // /api/project/{projectId} 获取体检项目详情
  delProject: '/api/project/delete', // /api/project/delete/{projectId} 获取体检项目详情
  projectAdd: '/api/project/add', //体检项目添加
  projectUpdate: '/api/project/update', //体检项目修改
  validCode: '/api/project/valid/code', //项目编码校验
  /* 合作机构 */
  getOrgPage: '/api/org/page',
  getOrgList: '/api/org/list', //获取机构列表
  getOrgDetail: '/api/org/detail', //获取机构详情
  isOrgcodeValid: '/api/project/valid/code',
  addOrg: '/api/org/add',
  updateOrg: '/api/org/update',
  deleteOrg: '/api/org/delete',
  getRegions: '/api/regions/tree', //获取区域树
  /* 健康知识 */
  getNews: '/api/news/page', //分页获取健康知识列表
  getNewsDetail: '/api/news/detail', // /api/news/detail/{newsId} 获取资讯详情
  newsAdd: '/api/news/add', //健康资讯添加
  newsUpdate: '/api/news/update', //健康资讯修改
  delNews: '/api/news/delete', //资讯删除
  /* 财务 */
  getNews: '/api/news/page', //分页获取健康知识列表
  getFinanceSettlement: '/api/finance/settlement/page', //财务结算
  getFinanceSettlementDetail: '/api/finance/settle/detail/page', //财务结算明细
  getFinanceBkge: '/api/finance/bkge/page', //佣金发放
  getFinanceBkgeDetail: '/api/finance/bkge/detail/page',
  exportFinanceSettlement: '/report/settlement/export', //财务结算导出
  exportBkgeDetail: '/report/bkge/detail/export', //佣金发放明细导出
  exportSettleDetail: '/report/settle/detail/export', //结算明细导出
  exportFinanceBkge: '/report/bkge/export', //佣金发放管理导出
  /* 系统 */
  getUserPage: '/api/user/page', //用户管理-查询
  getLogPage: '/api/log/page', //获取操作日志
  getUserInfo: '/api/sys/user/get', //加载账户信息
  updateUserInfo: '/api/sys/user/update', //账户设置-修改提交
  /* 首页 */
  getDateRangeDict: '/api/home/get/dict', //首页获取时间段
  getHomeOrder: '/api/home/get/order', //首页获取每日预约信息
}
