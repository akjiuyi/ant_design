<template>
  <a-modal
    title="添加分区"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!--分类名称-->
        <a-form-item  label="分区名称">
          <a-input placeholder="请输入分区名称"   v-decorator="['title', {rules: [{required: true, min: 2, message: '分区名称必须大于等于2个字符！'}]}]" />
        </a-form-item>
        <!--分类位置-->
        <!--<a-form-item label="位置">
          <a-select show-search placeholder="请选择一个位置" option-filter-prop="children" style="width: 180px" v-decorator="['position', {rules: [{required: true, message: '请选择分类位置！'}]}]">
            <a-select-option value="0">
              首页
            </a-select-option>
            <a-select-option value="1">
              会员页
            </a-select-option>
          </a-select>
        </a-form-item>-->

        <!--分类类型-->
        <a-form-item label="类型">
          <a-select show-search placeholder="请选择一个类型" option-filter-prop="children" v-decorator="['type', {rules: [{required: true, message: '请选择分类类型！'}]}]" @blur="getType">
            <a-select-option value="0">绑定作者-仅展示短视频</a-select-option>
            <a-select-option value="1">绑定作者-仅展示长视频-footer</a-select-option>
            <a-select-option value="2">绑定作者-仅展示长视频五宫格-footer</a-select-option>
            <a-select-option value="3">绑定作者-仅展示长视频-横向滚动</a-select-option>
            <a-select-option value="4">绑定视频分类-仅展示短视频</a-select-option>
            <a-select-option value="5">绑定视频分类-仅展示长视频-footer</a-select-option>
            <a-select-option value="6">绑定视频分类-仅展示长视频五宫格-footer</a-select-option>
            <a-select-option value="7">绑定视频分类-仅展示长视频五宫格-footer</a-select-option>
          </a-select>
        </a-form-item>

        <!--作者-->
        <a-form-item v-if="author_v" label="作者id">
          <a-input placeholder="请输入作者id" v-decorator="['author', {rules: [{required: true, message: '作者id不能为空！'}]}]" />
        </a-form-item>

        <!--表单id-->
        <a-form-item v-if="list_v" label="表单id">
          <a-input placeholder="请输入表单id" v-decorator="['list', {rules: [{required: true, message: '表单id不能为空！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['title', 'author', 'list', 'type']

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
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      author_v: false,
      list_v: false
    }
  },

  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
       this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    // 查看分区
    getType () {
        this.type = this.form.getFieldValue('type')
        if (this.type === '0' || this.type === '1' || this.type === '2' || this.type === '3') {
           this.author_v = true
           this.list_v = false
        } else if (this.type === '4' || this.type === '5' || this.type === '6' || this.type === '7') {
          this.list_v = true
          this.author_v = false
        }
    }
  }
}
</script>
