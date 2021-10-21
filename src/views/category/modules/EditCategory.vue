<template>
  <a-modal
    title="编辑分类"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!--分类名称-->
        <a-form-item  label="分类名称">
          <a-input placeholder="请输入分类名称"  v-decorator="['title', {rules: [{required: true, min: 2, message: '分类名称必须大于等于2个字符！'}]}]" />
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
          <a-select show-search placeholder="请选择一个类型" option-filter-prop="children"  v-decorator="['type', {rules: [{required: true, message: '请选择分类类型！'}]}]">
            <a-select-option value="0">
              类型0
            </a-select-option>
            <a-select-option value="1" >
              类型1
            </a-select-option>
            <a-select-option value="2">
              类型2
            </a-select-option>
            <a-select-option value="3">
              类型3
            </a-select-option>
            <a-select-option value="4">
              类型4
            </a-select-option>
            <a-select-option value="5">
              类型5
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['title', 'type']

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
      form: this.$form.createForm(this)
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      console.log('============')
      console.log(pick(this.model, fields))
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
