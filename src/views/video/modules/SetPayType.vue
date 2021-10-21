<template>
  <a-modal
    title="更改付费类型"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!--付费类型-->
        <a-form-item label="付费类型">
          <a-select show-search placeholder="请选择一个类型" option-filter-prop="children" v-decorator="['pay_type', {rules: [{required: true, message: '请选择分类类型！'}]}]" @blur="getPayType">
            <a-select-option value="0">
              免费
            </a-select-option>
            <a-select-option value="1" >
              金币购买
            </a-select-option>
            <a-select-option value="2">
              vip
            </a-select-option>
          </a-select>
        </a-form-item>

        <!--金币数量-->
        <a-form-item v-show="v" label="金币数量">
          <a-input placeholder="请输入金币数量" v-decorator="['coin', {rules: [{required: true, message: '金币不能为空！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['pay_type', 'coin']

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
      v: true
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      const obj = pick(this.model, fields)
      obj.pay_type = obj.pay_type.toString()
      this.model && this.form.setFieldsValue(obj)
      this.pay_type = this.form.getFieldValue('pay_type')
      if (this.pay_type === '1') {
        this.v = true
      } else {
        this.v = false
      }
    })
  },
  methods: {
    // 查看支付方式
    getPayType () {
      this.pay_type = this.form.getFieldValue('pay_type')
      if (this.pay_type === '1') {
        this.v = true
      } else {
        this.v = false
      }
    }
  }
}
</script>
