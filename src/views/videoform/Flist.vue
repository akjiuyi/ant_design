<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!--
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="调用次数">
                  <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      -->

      <div class="table-operator">
        <a-button type="primary"  @click="addForm">新增</a-button>
        <!--<a-button type="primary"  @click="handleValid">有效</a-button>
        <a-button type="primary"  @click="handleInvalid">无效</a-button>

        <a-dropdown v-action:edit >
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        -->
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="_id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text">
          {{ text._id }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text.join(';') }}</ellipsis>
        </span>
        <span slot="join" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text.join(";") }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="editForm(record)">编辑表单</a>
            <a-divider type="vertical" />
            <!--<a @click="addFormPic(record)">表单图片</a>
            <a-divider type="vertical" />-->
            <a @click="addVideo(record)">添加视频</a>
            <a-divider type="vertical" />
            <a @click="videoList(record)">视频列表</a>
          </template>
        </span>
      </s-table>

      <!--创建表单-->
      <add-form
        ref="AddForm"
        :visible="add_form_visible"
        :loading="confirmLoading"
        :model="add_form_mdl"
        @cancel="addFormCancel"
        @ok="addFormOk"
      />

      <!--编辑表单-->
      <edit-form
        ref="EditForm"
        :visible="edit_form_visible"
        :loading="confirmLoading"
        :model="edit_form_mdl"
        @cancel="editFormCancel"
        @ok="editFormOk"
      />

      <!--表单图片-->
      <add-form-pic
        ref="AddFormPic"
        :visible="add_form_pic_visible"
        :loading="confirmLoading"
        :model="add_form_pic_mdl"
        @cancel="addFormPicCancel"
        @ok="addFormPicOk"
      />

      <!--添加视频-->
      <add-video
        ref="AddVideo"
        :visible="add_video_visible"
        :loading="confirmLoading"
        :model="add_video_mdl"
        @cancel="addVideoCancel"
        @ok="addVideoOk"
      />

      <!--视频列表-->
      <a-modal v-model="video_list_visible"   ref="detail" title="视频列表" width="75%" @ok="closeVideoList">
        <s-table
          ref="table1"
          size="default"
          rowKey="_id"
          :columns="videoColumns"
          :data="loadVideoData"
          :alert="true"
          :rowSelection="videoRowSelection"
          showPagination="auto"
        >
        <span slot="serial" slot-scope="text">
          {{ text._id }}
        </span>
          <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
          <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
          <span slot="join" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text.join(";") }}</ellipsis>
        </span>

          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="deleteVideo(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getVideoFormList, setPayType, deleteFormVideo, addVideoForm, editVideoForm, addVideoToForm, getFormVideoList } from '@/api/manage'

import AddForm from './modules/AddForm'
import AddFormPic from './modules/AddFormPic'
import AddVideo from './modules/AddVideo'
import EditForm from './modules/EditForm'

const columns = [
  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '描述',
    dataIndex: 'des'
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
    customRender: (text) => text
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const videoColumns = [
  /*
  {
    title: 'id',
    scopedSlots: { customRender: 'serial' }
  },
   */
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '作者',
    dataIndex: 'author',
    customRender: (text) => {
      return text.nickname
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text) => {
      let str = ''
      if (text === 0) {
        str = '短视频'
      } else if (text === 1) {
        str = '长视频'
      }
      return str
    }
  },
  {
    title: '分类',
    dataIndex: 'categories',
    scopedSlots: { customRender: 'join' }
  },
  {
    title: '标签',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'join' }
  },
  {
    title: '演员',
    dataIndex: 'models',
    scopedSlots: { customRender: 'join' }
  },
  {
    title: '时长',
    dataIndex: 'duration'
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
    customRender: (text) => text
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
  name: 'HomeClist',
  components: {
    AddForm,
    AddFormPic,
    AddVideo,
    EditForm,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    this.videoColumns = videoColumns

    return {
      // create model
      top: 10,
      list_id: '',
      visible: false,
      add_form_visible: false,
      edit_form_visible: false,
      add_form_pic_visible: false,
      video_list_visible: false,
      add_video_visible: false,
      confirmLoading: false,
      mdl: null,
      add_form_mdl: null,
      edit_form_mdl: null,
      add_form_pic_mdl: null,
      add_video_mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getVideoFormList(requestParameters)
          .then(res => {
            if (res.code === 0) {
              return res
            }
          }).catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          }).finally(() => {
          })
      },
      // 加载数据方法 必须为 Promise 对象
      loadVideoData: parameter => {
        const requestParameters = Object.assign({}, parameter, { list_id: this.list_id }, this.queryParam)
        console.log('loadData request parameters:', requestParameters)

        return getFormVideoList(requestParameters)
          .then(res => {
            if (res.code === 0) {
              return res
            }
          }).catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          }).finally(() => {
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      selectedVideoRowKeys: [],
      selectedVideoRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    joinFilter (text) {
      let str = ''
      for (var i = 0; i < text.length; i++) {
        str += text[i] + ';'
      }

      return str
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
    },
    videoRowSelection () {
      return {
        selectedVideoRowKeys: this.selectedVideoRowKeys,
        onChange: this.onVideoSelectChange
      }
    }
  },
  methods: {
    // 创建表单
    addForm () {
      // this.user_id = record._id
      // this.add_form_mdl = { title: null, des: null, pic: null }
      this.add_form_visible = true
    },
    // 编辑表单
    editForm (record) {
      // 获取视频信息
      this.list_id = record._id
      this.edit_form_visible = true
      this.edit_form_mdl = { ...record }
      console.log('vvv444', this.edit_form_mdl)
      // const param = { _id: record._id }
      /*
      getVideoFormInfo(param).then(res => {
        this.edit_form_mdl = { ...res.data }
        this.edit_form_visible = true
      })
       */
    },
    // 表单图片
    addFormPic (record) {
      // 视频列表
      console.log('===')
      console.log(record)
      this.add_form_pic_visible = true
      this.add_form_pic_mdl = { ...record }
    },
    // 视频列表
    videoList (record) {
      // 视频列表
      this.list_id = record._id
      this.video_list_visible = true
      this.$refs.table1.refresh()
    },
    // 添加视频
    addVideo (record) {
      this.list_id = record._id
      this.add_video_visible = true
      this.add_video_mdl = null
    },
    // 添加表单
    addFormOk () {
      const form = this.$refs.AddForm.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('====')
          console.log('values', values)

          addVideoForm(values).then(res => {
            this.add_form_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('添加视频表单成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    // 添加表单
    editFormOk () {
      const form = this.$refs.EditForm.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.list = this.list_id
          console.log('====')
          console.log('values', values)

          editVideoForm(values).then(res => {
            this.edit_form_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('编辑视频表单成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
   addFormPicOk () {
      const form = this.$refs.AddFormPic.form
      this.add_form_pic_visible = false
      this.confirmLoading = false

      // 重置表单数据
      this.add_form_pic_mdl = null
      form.resetFields()
      // 刷新表格
      this.$refs.table.refresh()
      this.$message.info('设置表单图片成功')
    },
    addVideoOk () {
      const form = this.$refs.AddVideo.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('====')
          console.log('values', values)
          values.list_id = this.list_id

          addVideoToForm(values).then(res => {
            this.add_video_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            // this.$refs.table.refresh()

            this.$message.info('添加视频成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 删除视屏
    deleteVideo (record) {
      const param = { video_id: record._id, list_id: this.list_id }
      const table1 = this.$refs.table1
      const message = this.$message
      this.$confirm({
        title: '提示',
        content: '确定要删除该视频吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          deleteFormVideo(param).then(res => {
            console.log(res)
            if (res.code === 0) {
              table1.refresh()
              message.info('视频删除成功')
            } else {
              message.info('视频删除失败')
            }
          })
        }
      })
      // this.add_category_visible = false
    },
    setVipOk () {
      const form = this.$refs.SetPayType.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.video_id = this.video_id
          console.log('values', values)

          setPayType(values).then(res => {
            this.set_pay_type_visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('更改支付成功')
          })
        } else {
          this.confirmLoading = false
        }
      })
      // this.add_category_visible = false
    },
    addFormCancel () {
      this.confirmLoading = false
      this.add_form_visible = false
    },
    addVideoCancel () {
      this.confirmLoading = false
      this.add_video_visible = false
    },
    editFormCancel () {
      this.confirmLoading = false
      this.edit_form_visible = false
    },
    addFormPicCancel () {
      this.add_form_pic_mdl = null
      this.confirmLoading = false
      this.add_form_pic_visible = false
    },
    closeVideoList () {
      this.video_list_visible = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onVideoSelectChange (selectedRowKeys, selectedRows) {
      this.selectedVideoRowKeys = selectedRowKeys
      this.selectedVideoRows = selectedRows
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
