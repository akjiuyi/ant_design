<template>
  <a-modal
    title="添加角色"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item label="角色名称">
          <a-input placeholder="输入角色名称" v-decorator="['name', [{required: true, min: 1, message: '请输入角色名称！'}]]" />
        </a-form-item>

        <a-form-item label="描述">
          <a-input placeholder="输入角色描述" v-decorator="['description', {rules: [{required: true, message: '请输入角色描述'}]}]" />
        </a-form-item>

        <a-form-item label="菜单">
          <a-tree
            v-model="checkedKeys"
            checkable
            checkStrictly
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @select="onSelect"
            @check="onCheck"
          />
        </a-form-item>

        <a-form-item>
        <a-input type="hidden" placeholder="输入选择菜单" v-decorator="['menus', {rules: [{required: true,  message: '请选择菜单'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'

// 表单字段
const fields = ['name', 'description', 'menus']

const treeData = [
  {
    title: '系统设置',
    key: '1',
    children: [
      /*
      {
        title: '广告设置',
        key: '2'
      },
      {
        title: '公告管理',
        key: '3'
      },
      {
        title: '推广管理',
        key: '4'
      },
      {
        title: '交流群',
        key: '5'
      },
       */
      {
        title: '角色管理',
        key: '8'
      },
      {
        title: '后台用户',
        key: '9'
      }
    ]
  },
  {
    title: '分类管理',
    key: '20',
    children: [
      { title: '首页分类列表', key: '21' },
      { title: '会员页分类列表', key: '22' }
    ]
  },
  {
    title: '分区管理',
    key: '40',
    children: [
      { title: '分区列表', key: '41' }
    ]
  },
  {
    title: '视频管理',
    key: '60',
    children: [
      { title: '视频列表', key: '61' }
    ]
  },
  {
    title: '用户管理',
    key: '80',
    children: [
      { title: '用户列表', key: '81' }
    ]
  },
  {
    title: '表单管理',
    key: '100',
    children: [
      { title: '视频表单', key: '101' }
    ]
  },
  {
    title: '数据统计',
    key: '120',
    children: [
      { title: '数据总表', key: '121' },
      { title: '留存分析', key: '122' }
    ]
  }
]

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      expandedKeys: [],
      autoExpandParent: false,
      checkedKeys: [],
      selectedKeys: [],
      treeData
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
     fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    onExpand (expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.form.setFieldsValue({ 'menus': checkedKeys.checked })
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
    }
  }
}
</script>
