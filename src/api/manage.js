import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  advertList: '/advertList',
  announcementList: '/announcementList',
  promote: '/promoteList',
  categoryList: '/category',
  sectionOfCategory: '/category/sections',
  addCategory: '/category',
  addSection: '/section',
  setCategoryState: '/category/status',
  setSectionState: '/section/status',
  sectionList: '/section',
  getVideoOfSection: '/section/videos',
  getVideoList: '/videos',
  bindVideoToSection: '/video/section',
  setPayType: '/video/paytype',
  bindVideoAuthor: '/video/author',
  bindVideoModels: '/video/models',
  setVideoState: '/video/status',
  getVideoInfo: '/video',
  editVideo: '/video',
  getMemberList: '/users',
  searchMember: '/user/search',
  setUserGroup: '/user/group',
  addMemberCoin: '/user/coin',
  getVideoFormList: '/list',
  addVideoForm: '/list',
  editVideoForm: '/list/edit',
  addVideoToForm: '/video/list',
  getFormVideoList: '/list/videos',
  deleteFormVideo: '/video/list',
  getRoleLists: '/user/roles',
  addRole: '/user/addrole',
  editRole: '/user/editrole',
  deleteRole: '/user/deleterole',
  getUserLists: '/user/lists',
  addUser: '/user/add',
  deleteUser: '/user/delete',
  getRoles: '/user/getroles',
  editUser: '/user/edituser',
  getRegisterCount: '/data/users',
  getActiveCount: '/data/activeUsers',
  getVipRecharge: '/data/vipRecs',
  getCoinRecharge: '/data/coinsRecs',
  getRemainStatistics: '/data/remainStatistics'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

// 新增请求函数
// 广告管理
export function getAdvertList (parameter) {
  return request({
    url: api.advertList,
    method: 'get',
    params: parameter
  })
}

// 公告管理
export function getAnnouncementList (parameter) {
  return request({
    url: api.announcementList,
    method: 'get',
    params: parameter
  })
}

// 推广管理
export function getPromoteList (parameter) {
  return request({
    url: api.promote,
    method: 'get',
    params: parameter
  })
}

// 获取角色列表
export function getRoleLists (parameter) {
  return request({
    url: api.getRoleLists,
    method: 'get',
    params: parameter
  })
}

// 分类管理
// 首页分类
export function getCategoryList (parameter) {
  return request({
    url: api.categoryList,
    method: 'get',
    params: parameter
  })
}

// 获取分类下的分区
export function getSectionOfCategory (parameter) {
  return request({
    url: api.sectionOfCategory,
    method: 'get',
    params: parameter
  })
}

// 添加分类
export function addCategory (parameter) {
  return request({
    url: api.addCategory,
    method: 'post',
    data: parameter
  })
}

// 添加分区
export function addSection (parameter) {
  return request({
    url: api.addSection,
    method: 'post',
    data: parameter
  })
}

// 设置分类状态
export function setCategoryState (parameter) {
  return request({
    url: api.setCategoryState,
    method: 'PATCH',
    data: parameter
  })
}

// 设置专区状态
export function setSectionState (parameter) {
  return request({
    url: api.setSectionState,
    method: 'PATCH',
    data: parameter
  })
}

// 分区管理
// 获取分区列表
export function getSectionList (parameter) {
  return request({
    url: api.sectionList,
    method: 'get',
    params: parameter
  })
}

// 获取分区下视频列表
export function getVideoOfSection (parameter) {
  return request({
    url: api.getVideoOfSection,
    method: 'get',
    params: parameter
  })
}

// 获取视频列表
export function getVideoList (parameter) {
  return request({
    url: api.getVideoList,
    method: 'get',
    params: parameter
  })
}

// 绑定视频到分区
export function BindVideoToSection (parameter) {
  return request({
    url: api.bindVideoToSection,
    method: 'PATCH',
    data: parameter
  })
}

// 设置支付类型
export function setPayType (parameter) {
  return request({
    url: api.setPayType,
    method: 'PATCH',
    data: parameter
  })
}

// 绑定视频作者
export function bindVideoAuthor (parameter) {
  return request({
    url: api.bindVideoAuthor,
    method: 'PATCH',
    data: parameter
  })
}

// 绑定视频演员
export function bindVideoModels (parameter) {
  return request({
    url: api.bindVideoModels,
    method: 'PATCH',
    data: parameter
  })
}

// 视频上下架
export function setVideoState (parameter) {
  return request({
    url: api.setVideoState,
    method: 'PATCH',
    data: parameter
  })
}

// 获取视频信息
export function getVideoInfo (parameter) {
  return request({
    url: api.getVideoInfo,
    method: 'get',
    params: parameter
  })
}

// 编辑视频
export function editVideo (parameter) {
  return request({
    url: api.editVideo,
    method: 'PATCH',
    data: parameter
  })
}

// 用户列表
export function getMemberList (parameter) {
  return request({
    url: api.getMemberList,
    method: 'get',
    params: parameter
  })
}

// 通过平台id获取用户信息
export function searchMember (parameter) {
  return request({
    url: api.searchMember,
    method: 'get',
    params: parameter
  })
}

// 设置用户组
export function setUserGroup (parameter) {
  return request({
    url: api.setUserGroup,
    method: 'PATCH',
    data: parameter
  })
}

// 增加金币
export function addMemberCoin (parameter) {
  return request({
    url: api.addMemberCoin,
    method: 'PATCH',
    data: parameter
  })
}

// 视频表单列表
export function getVideoFormList (parameter) {
  return request({
    url: api.getVideoFormList,
    method: 'get',
    params: parameter
  })
}

// 添加视频表单
export function addVideoForm (parameter) {
  return request({
    url: api.addVideoForm,
    method: 'post',
    data: parameter
  })
}

// 编辑视频表单
export function editVideoForm (parameter) {
  return request({
    url: api.editVideoForm,
    method: 'post',
    data: parameter
  })
}

// 添加视频到表单
export function addVideoToForm (parameter) {
  return request({
    url: api.addVideoToForm,
    method: 'post',
    data: parameter
  })
}

// 获取表单下视频
export function getFormVideoList (parameter) {
  return request({
    url: api.getFormVideoList,
    method: 'get',
    params: parameter
  })
}

// 删除表单下视频
export function deleteFormVideo (parameter) {
  return request({
    url: api.deleteFormVideo,
    method: 'DELETE',
    data: parameter
  })
}

// 添加角色
export function addRole (parameter) {
  return request({
    url: api.addRole,
    method: 'post',
    data: parameter
  })
}

// 编辑角色
export function editRole (parameter) {
  return request({
    url: api.editRole,
    method: 'post',
    data: parameter
  })
}

// 删除角色
export function deleteRole (parameter) {
  return request({
    url: api.deleteRole,
    method: 'post',
    data: parameter
  })
}

// 获取管理后台用户列表
export function getUserLists (parameter) {
  return request({
    url: api.getUserLists,
    method: 'get',
    params: parameter
  })
}

// 添加管理后台用户
export function addUser (parameter) {
  return request({
    url: api.addUser,
    method: 'post',
    data: parameter
  })
}

// 删除管理后台用户
export function deleteUser (parameter) {
  return request({
    url: api.deleteUser,
    method: 'post',
    data: parameter
  })
}

// 获取管理后台角色
export function getRoles (parameter) {
  return request({
    url: api.getRoles,
    method: 'get',
    data: parameter
  })
}

// 添加管理后台用户
export function editUser (parameter) {
  return request({
    url: api.editUser,
    method: 'post',
    data: parameter
  })
}

// 统计
// 获取注册用户数
export function getRegisterCount (parameter) {
  return request({
    url: api.getRegisterCount,
    method: 'get',
    params: parameter
  })
}

// 获取活跃用户数
export function getActiveCount (parameter) {
  return request({
    url: api.getActiveCount,
    method: 'get',
    params: parameter
  })
}

// 会员充值金额
export function getVipRecharge (parameter) {
  return request({
    url: api.getVipRecharge,
    method: 'get',
    params: parameter
  })
}

// 会员充值金额
export function getCoinRecharge (parameter) {
  return request({
    url: api.getCoinRecharge,
    method: 'get',
    params: parameter
  })
}

// 获取留存统计
export function getRemainStatistics (parameter) {
  return request({
    url: api.getRemainStatistics,
    method: 'get',
    params: parameter
  })
}
