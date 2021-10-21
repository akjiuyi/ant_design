<template>
  <a-modal
    title="上传表单图片"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!--图片上传-->
        <a-form-item label="图片上传">
          <a-upload
            name="pic"
            :data="upload_data"
            :headers="upload_header"
            method="post"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="upload_url"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <a-input type="hidden" v-decorator="['pic', {rules: [{required: true,  message: '请上传图片'}]}]"/>
            <img v-if="imageUrl" :src="imageUrl"  alt="pic" style="width: 6rem;"/>
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 表单字段
const fields = ['_id', 'pic']

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

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
      imageUrl: '',
      uploading: false,
      upload_data: {},
      upload_header: {},
      upload_url: process.env.VUE_APP_UPLOAD_API_URL + 'backend-api/list/pic'
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.form.resetFields()
      const obj = pick(this.model, fields)
      console.log('$$')
      console.log(obj)
      this.upload_data = { list_id: obj._id }
      const picObj = { pic: obj.pic }
      this.model && this.form.setFieldsValue(picObj)
      this.upload_header = { token: storage.get(ACCESS_TOKEN) }
      const pic = this.form.getFieldValue('pic')
      if (pic) {
        this.imageUrl = process.env.VUE_APP_UPLOAD_STATIC_BASE_URL + pic
      } else {
        this.imageUrl = ''
      }
    })
  },
  methods: {
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.uploading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.uploading = false
        })

        if (info.fileList[0].response.code === 0) {
          const screenshot = info.fileList[0].response.data.screenshot
          this.form.setFieldsValue({ pic: screenshot })
          // console.log(']]]]]')
          // console.log(screenshot)
          this.$message.info('图片上传成功')
        } else {
          this.$message.info('图片上传失败')
        }
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    }
  }
}
</script>
