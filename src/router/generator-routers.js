// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import storage from 'store'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 系统
  Advert: () => import('@/views/system/Advert'),
  Announcement: () => import('@/views/system/Announcement'),
  Promote: () => import('@/views/system/Promote'),
  ExchGroup: () => import('@/views/system/ExchGroup'),
  Role: () => import('@/views/system/Role'),
  User: () => import('@/views/system/User'),

  // 分类管理
  // 首页分类
  HomeClist: () => import('@/views/category/HomeClist'),
  // 会员页分类
  MemberClist: () => import('@/views/category/MemberClist'),

  // 分区管理
  Slist: () => import('@/views/section/Slist'),

  // 视频管理
  Vlist: () => import('@/views/video/Vlist'),

  // 用户管理
  Mlist: () => import('@/views/member/Mlist'),

  // 表单管理
  Flist: () => import('@/views/videoform/Flist'),

  // 测试
  Test: () => import('@/views/videoform/Test'),

  // 数据统计 数据总表
  TotalTable: () => import('@/views/statistics/TotalTable'),
  // 留存分析
  Remain: () => import('@/views/statistics/Remain'),

  // 你需要动态引入的页面组件
  Workplace: () => import('@/views/dashboard/Workplace'),
  Analysis: () => import('@/views/dashboard/Analysis'),

  // form
  BasicForm: () => import('@/views/form/basicForm'),
  StepForm: () => import('@/views/form/stepForm/StepForm'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  TableList: () => import('@/views/list/TableList'),
  StandardList: () => import('@/views/list/BasicList'),
  CardList: () => import('@/views/list/CardList'),
  SearchLayout: () => import('@/views/list/search/SearchLayout'),
  SearchArticles: () => import('@/views/list/search/Article'),
  SearchProjects: () => import('@/views/list/search/Projects'),
  SearchApplications: () => import('@/views/list/search/Applications'),
  ProfileBasic: () => import('@/views/profile/basic'),
  ProfileAdvanced: () => import('@/views/profile/advanced/Advanced'),

  // result
  ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // account
  AccountCenter: () => import('@/views/account/center'),
  AccountSettings: () => import('@/views/account/settings/Index'),
  BasicSetting: () => import('@/views/account/settings/BasicSetting'),
  SecuritySettings: () => import('@/views/account/settings/Security'),
  CustomSettings: () => import('@/views/account/settings/Custom'),
  BindingSettings: () => import('@/views/account/settings/Binding'),
  NotificationSettings: () => import('@/views/account/settings/Notification')

  // 'TestWork': () => import(/* webpackChunkName: "TestWork" */ '@/views/dashboard/TestWork')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 前端未找到页面路由（固定不用改）
/*
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}
 */

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/category/home-clist',
  meta: {
    title: '首页'
  },
  children: []
}

// 菜单
/*
const nav = [
  // 系统
  {
    name: 'system',
    parentId: 0,
    id: 1,
    meta: {
      icon: 'setting',
      title: '系统设置',
      show: true
    },
    component: 'RouteView',
    redirect: '/system/advert'
  },
  {
    name: 'advert',
    parentId: 1,
    id: 2,
    meta: {
      title: '广告设置',
      show: true
    },
    path: '/system/advert/:pageNo([1-9]\\d*)?',
    component: 'Advert'
  },
  {
    name: 'announcement',
    parentId: 1,
    id: 3,
    meta: {
      title: '公告管理',
      show: true
    },
    path: '/system/announcement/:pageNo([1-9]\\d*)?',
    component: 'Announcement'
  },
  {
    name: 'Promote',
    parentId: 1,
    id: 4,
    meta: {
      title: '推广管理',
      show: true
    },
    path: '/system/promote/:pageNo([1-9]\\d*)?',
    component: 'Promote'
  },
  {
    name: 'exch-group',
    parentId: 1,
    id: 5,
    meta: {
      title: '交流群',
      show: true
    },
    path: '/system/exch-group',
    component: 'ExchGroup'
  },
  {
    name: 'role',
    parentId: 1,
    id: 8,
    meta: {
      title: '角色管理',
      show: true
    },
    component: 'Role',
    path: '/system/role/:pageNo([1-9]\\d*)?'
  },
  {
    name: 'user',
    parentId: 1,
    id: 9,
    meta: {
      title: '后台用户',
      show: true
    },
    component: 'User',
    path: '/system/user/:pageNo([1-9]\\d*)?'
  },
  // 分类管理
  {
    name: 'category',
    parentId: 0,
    id: 20,
    meta: {
      icon: 'dashboard',
      title: '分类管理',
      show: true
    },
    component: 'RouteView',
    redirect: '/category/list'
  },
  {
    name: 'home-clist',
    parentId: 20,
    id: 21,
    meta: {
      title: '首页分类列表',
      show: true
    },
    path: '/category/home-clist',
    component: 'HomeClist'
  },
  {
    name: 'member-clist',
    parentId: 20,
    id: 22,
    meta: {
      title: '会员页分类列表',
      show: true
    },
    path: '/category/member-clist',
    component: 'MemberClist'
  },
  // 分区管理
  {
    name: 'section',
    parentId: 0,
    id: 40,
    meta: {
      icon: 'plus-square',
      title: '分区管理',
      show: true
    },
    component: 'RouteView',
    redirect: '/section/slist'
  },
  {
    name: 'section-list',
    parentId: 40,
    id: 41,
    meta: {
      title: '分区列表',
      show: true
    },
    path: '/section/slist',
    component: 'Slist'
  },
  // 视频管理
  {
    name: 'video',
    parentId: 0,
    id: 60,
    meta: {
      icon: 'dashboard',
      title: '视频管理',
      show: true
    },
    component: 'RouteView',
    redirect: '/video/vlist'
  },
  {
    name: 'video-list',
    parentId: 60,
    id: 61,
    meta: {
      title: '视频列表',
      show: true
    },
    path: '/video/vlist',
    component: 'Vlist'
  },
  // 用户管理
  {
    name: 'member',
    parentId: 0,
    id: 80,
    meta: {
      icon: 'dashboard',
      title: '用户管理',
      show: true
    },
    component: 'RouteView',
    redirect: '/member/mlist'
  },
  {
    name: 'member-list',
    parentId: 80,
    id: 81,
    meta: {
      title: '用户列表',
      show: true
    },
    path: '/member/mlist',
    component: 'Mlist'
  },
  // 表单管理
  {
    name: 'video-form',
    parentId: 0,
    id: 100,
    meta: {
      icon: 'dashboard',
      title: '表单管理',
      show: true
    },
    component: 'RouteView',
    redirect: '/videoform/flist'
  },
  {
    name: 'video-form-list',
    parentId: 100,
    id: 101,
    meta: {
      title: '视频表单',
      show: true
    },
    path: '/videoform/flist',
    component: 'Flist'
  },
  // 数据统计
  {
    name: 'data-statistics',
    parentId: 0,
    id: 120,
    meta: {
      icon: 'dashboard',
      title: '数据统计',
      show: true
    },
    component: 'RouteView',
    redirect: '/statistics/total-table'
  },
  {
    name: 'statistics-total-table',
    parentId: 120,
    id: 121,
    meta: {
      title: '数据总表',
      show: true
    },
    path: '/statistics/total-table',
    component: 'TotalTable'
  }
]
 */

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = token => {
  return new Promise((resolve, reject) => {
    const param = { user_id: storage.get('user_id') }

    loginService
      .getCurrentUserNav(param)
      .then(res => {
        // console.log('generatorDynamicRouter response:', res)
        // 打包适配代码
        res.result = res.data // 接口获取菜单
        // res.result = nav   // 本地配置菜单
        res.data = null
        //
        const { result } = res
        const menuNav = []
        const childrenNav = []
        //      后端数据, 根级树数组,  根级 PID
        listToTree(result, childrenNav, 0)
        rootRouter.children = childrenNav
        menuNav.push(rootRouter)
        console.log('menuNav', menuNav)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        console.log('routers', routers)
        resolve(routers)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
