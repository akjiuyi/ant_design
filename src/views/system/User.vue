<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-operator">
        <a-button type="primary"  @click="addUser">新增</a-button>
        <a-dropdown v-action:edit >
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text">
          {{ text }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="35" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="editUser(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="deleteUser(record)">删除</a>
          </template>
        </span>
      </s-table>

      <add-user
        ref="AddUser"
        :visible="add_user_visible"
        :loading="confirmLoading"
        :model="add_user_mdl"
        @cancel="AddUserCancel"
        @ok="AddUserOk"
      />

      <edit-user
        ref="EditUser"
        :visible="edit_user_visible"
        :loading="confirmLoading"
        :model="edit_user_mdl"
        @cancel="EditUserCancel"
        @ok="EditUserOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { addUser, editUser, getRoles, getUserLists, deleteUser } from '@/api/manage'

import AddUser from './modules/AddUser'
import EditUser from './modules/EditUser'

const columns = [
  {
    title: '账号id',
    dataIndex: '_id',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '账号',
    dataIndex: 'username',
    scopedSlots: { customRender: 'description' }
  },
  /*
  {
    title: '角色id',
    dataIndex: 'role_id',
    // scopedSlots: { customRender: 'link_type' }
    scopedSlots: { customRender: 'description' }
  },
   */
  {
    title: '角色名称',
    dataIndex: 'roles_docs.name',
    // scopedSlots: { customRender: 'link_type' }
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'Role',
  components: {
    AddUser,
    EditUser,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      role_id: '',
      user_id: '',
      add_user_visible: false,
      edit_user_visible: false,
      confirmLoading: false,
      add_user_mdl: null,
      edit_user_mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)

        return getUserLists(requestParameters)
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    addUser () {
      getRoles().then(res => {
        this.add_user_mdl = { roles: res.data }
        this.add_user_visible = true
      })
    },
    editUser (record) {
      this.user_id = record._id
      getRoles().then(res => {
        record.roles = res.data
        record.password = null
        this.edit_user_visible = true
        this.edit_user_mdl = { ...record }
      })
    },
    deleteUser (record) {
      const param = { _id: record._id }
      const table = this.$refs.table
      const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要删除该账号吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          deleteUser(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table.refresh()
              message.info('账号删除成功')
            } else {
              message.info('账号删除失败')
            }
          })
        }
      })
    },
    AddUserCancel () {
      this.add_user_visible = false
    },
    EditUserCancel () {
      this.edit_user_visible = false
    },
    AddUserOk () {
      // this.add_role_visible = false
      const form = this.$refs.AddUser.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          addUser(values).then(res => {
            this.add_user_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('添加后台账号成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    EditUserOk () {
      const form = this.$refs.EditUser.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.user_id = this.user_id
          if (!values.password) {
            values.password = null
          }
          editUser(values).then(res => {
            this.edit_user_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('编辑用户成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 添加提交
    addOk () {
      this.add_visible = false
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
