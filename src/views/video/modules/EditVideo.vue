<template>
  <a-modal
    title="编辑视频"
    :width="770"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!--标题-->
        <a-form-item  label="标题">
          <a-input placeholder="请输入标题" v-decorator="['title', {rules: [{required: true,  message: '请输入标题'}]}]" />
        </a-form-item>
        <!--时长-->
        <a-form-item  label="时长">
          <a-input placeholder="请输入时长" v-decorator="['duration', {rules: [{required: true,  message: '请输入时长'}]}]" />
        </a-form-item>

        <a-form-item  label="分类">
          <a-checkbox-group  v-decorator="['categories', {rules: [{required: false,  message: '请选择分类'}]}]" >
            <a-checkbox :key="index" v-for="(cate, index) in categories" :value="cate.name">{{ cate.name }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item  label="标签">
          <a-checkbox-group  v-decorator="['tags', {rules: [{required: false,  message: '请选择标签'}]}]">
            <a-checkbox :key="index" v-for="(tag, index) in tags" :value="tag.name">{{ tag.name }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item  label="演员">
          <a-checkbox-group  v-decorator="['models', {rules: [{required: false,  message: '请选择演员'}]}]">
            <a-checkbox :key="index" v-for="(model, index) in models" :value="model">{{ model }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="演员名称">
          <a-input placeholder="请输入演员名称" v-model="author" /><a-button type="primary" size="small" @click="appendActor">添加演员</a-button>
        </a-form-item>

        <a-form-item label="类型">
          <a-select show-search placeholder="请选择类型" option-filter-prop="children" style="width: 180px" v-decorator="['type', {rules: [{required: true, message: '请选择视频类型！'}]}]">
            <a-select-option value="0">
              短视频
            </a-select-option>
            <a-select-option value="1">
              长视频
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="图片上传">
          <a-upload
            name="pic"
            :data="upload_data"
            :headers="upload_header"
            method="PATCH"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="upload_url"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <a-input type="hidden" v-decorator="['screenshot', {rules: [{required: true, message: '请上传视频'}]}]"/>
            <img v-if="imageUrl" :src="imageUrl" alt="pic" style="width: 6rem;"/>
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
const fields = ['_id', 'title', 'duration', 'categories', 'tags', 'models', 'screenshot', 'type', 'screenshot']

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
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      uploading: false,
      imageUrl: '',
      categories: [],
      tags: [],
      models: [],
      author: '',
      upload_data: {},
      upload_header: {},
      upload_url: process.env.VUE_APP_UPLOAD_API_URL + 'backend-api/video/image'
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      const obj = pick(this.model, fields)
      obj.type = obj.type.toString()

      this.model && this.form.setFieldsValue(obj)
      this.type = this.form.getFieldValue('type')
      this.categories = this.form.getFieldValue('categories')
      this.tags = this.form.getFieldValue('tags')
      this.models = this.form.getFieldValue('models')
      this.upload_data = { video_id: this.form.getFieldValue('_id') }
      this.upload_header = { token: storage.get(ACCESS_TOKEN) }
      this.imageUrl = process.env.VUE_APP_UPLOAD_STATIC_BASE_URL + this.form.getFieldValue('screenshot')

      const categories = []
      for (var i = 0; i < obj.categories.length; i++) {
        if (obj.categories[i].select === true) {
          categories.push(obj.categories[i].name)
        }
      }
      obj.categories = categories

      const tags = []
      for (var j = 0; j < obj.tags.length; j++) {
        if (obj.tags[j].select === true) {
          tags.push(obj.tags[j].name)
        }
      }
      obj.tags = tags

      this.model && this.form.setFieldsValue(obj)
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
            this.form.setFieldsValue({ screenshot: screenshot })
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
    },
    appendActor () {
      try {
        if (!this.author) {
          throw new Error('请输入演员名称')
        }

        this.models.forEach(element => {
          if (element === this.author) {
            throw new Error('不能输入相同名称的演员')
          }
        })
        // this.models.push(this.author)
        this.model.models.push(this.author)
      } catch (e) {
        this.$message.error(e.toString())
      }
    }
  }
}
</script>
