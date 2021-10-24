<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-operator">
        <a-button type="primary"  @click="addRole">新增</a-button>
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
            <a @click="editRole(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="deleteRole(record)">删除</a>
          </template>
        </span>
      </s-table>

      <add-role
        ref="AddRole"
        :visible="add_role_visible"
        :loading="confirmLoading"
        :model="add_role_mdl"
        @cancel="AddRoleCancel"
        @ok="AddRoleOk"
      />

      <edit-role
        ref="EditRole"
        :visible="edit_role_visible"
        :loading="confirmLoading"
        :model="edit_role_mdl"
        @cancel="EditRoleCancel"
        @ok="EditRoleOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { addRole, editRole, getRoleLists, deleteRole } from '@/api/manage'

import AddRole from './modules/AddRole'
import EditRole from './modules/EditRole'

const columns = [
  {
    title: '角色id',
    dataIndex: '_id',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '角色描述',
    dataIndex: 'description',
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
    AddRole,
    EditRole,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      role_id: '',
      add_role_visible: false,
      edit_role_visible: false,
      confirmLoading: false,
      add_role_mdl: null,
      edit_role_mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        /*
        return getPromoteList(requestParameters)
          .then(res => {
            return res.result
          })
         */

        return getRoleLists(requestParameters)
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
    addRole () {
      const form = this.$refs.AddRole.form
      form.resetFields()
      this.add_role_visible = true
    },
    editRole (record) {
      this.role_id = record._id
      this.edit_role_visible = true
      this.edit_role_mdl = { ...record }
    },
    deleteRole (record) {
      const param = { _id: record._id }
      const table = this.$refs.table
      const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要删除该角色吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          deleteRole(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table.refresh()
              message.info('角色删除成功')
            } else {
              message.info('角色删除失败')
            }
          })
        }
      })
    },
    AddRoleCancel () {
      this.add_role_visible = false
    },
    EditRoleCancel () {
      this.edit_role_visible = false
    },
    AddRoleOk () {
      // this.add_role_visible = false
      const form = this.$refs.AddRole.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('====')
          console.log('values', values)
          values.role_id = this.role_id
          addRole(values).then(res => {
            this.add_role_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('添加角色成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    EditRoleOk () {
      // this.add_role_visible = false
      const form = this.$refs.EditRole.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('====')
          console.log(this.role_id)
          values.role_id = this.role_id
          console.log('values', values)

          editRole(values).then(res => {
            this.edit_role_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('编辑角色成功')
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
