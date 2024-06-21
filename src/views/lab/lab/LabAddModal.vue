<template>
  <a-modal
      v-model:visible="visible"
      :title="title"
      :mask-closable="false"
      :esc-to-close="false"
      :modal-style="{ maxWidth: '520px' }"
      width="90%"
      @before-ok="save"
      @close="reset"
  >
    <!--    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" /> -->
    <a-form :model="form" :auto-label-width="true" layout="horizontal">
      <a-space direction="vertical" size="large" style="margin: 0 auto">
        <a-form-item field="name" label="实验室名称">
          <a-input v-model="form.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item field="buildingName" label="所属建筑">
          <a-input v-model="form.buildingName" placeholder="请输入所属建筑名称" />
        </a-form-item>
        <a-form-item field="deptName" :style="{ width: '300px' }" label="所属学院">
          <!--          <a-input v-model="form.deptName" placeholder="请输入所属学院名称" /> -->
          <a-select v-model="form.deptName" placeholder="请选择实验室" allow-search :filter-option="false" :loading="deptLoading" @change="deptHandleChange" @search="deptHandleSearch">
            <a-option v-for="item of deptOptions" :key="item.id" :value="item.name">{{ item.name }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="userId" :style="{ width: '300px' }" label="维护人员">
          <a-select v-model="form.userName" allow-search :filter-option="false" :loading="loading" placeholder="请选择维护人员"
                    @search="handleSearch" @change="handleChange">
            <a-option v-for="item of options" :key="item.userId" :value="item">{{ item.username }}</a-option>
          </a-select>
        </a-form-item>
      </a-space>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { addLab, getLab, labListDept, selectUserListByName, updateLab } from '@/apis'
// import type { type Columns, GiForm, type Options } from '@/components/GiForm'

import { useForm } from '@/hooks'

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改实验室' : '新增实验室'))

// const formRef = ref<InstanceType<typeof GiForm>>()

// const options: Options = {
//   form: {},
//   col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
//   btns: { hide: true }
// }
//
// const columns: Columns = [
//   {
//     label: '名称',
//     field: 'name',
//     type: 'input',
//     rules: [{ required: true, message: '请输入' }]
//   },
//   {
//     label: '所属建筑名称',
//     field: 'buildingName',
//     type: 'input',
//     rules: [{ required: true, message: '请输入' }]
//   },
//   {
//     label: '维护人员ID',
//     field: 'userId',
//     type: 'select'
//   }
// ]

const { form, resetForm } = useForm({
  userId: '',
  name: '',
  buildingName: '',
  deptName: '',
  deptId: '',
  userName: ''
})

const options = ref()
const loading = ref(false)

const handleSearch = (value) => {
  if (value) {
    loading.value = true
    window.setTimeout(async () => {
      const res = await selectUserListByName(value)
      options.value = res.data
      // console.log(111)
      // console.log(options.value)
      loading.value = false
    }, 1000)
  } else {
    options.value = []
  }
}

const deptLoading = ref(false)
const deptOptions = ref()
const deptHandleSearch = (value) => {
  if (value) {
    deptLoading.value = true
    window.setTimeout(async () => {
      const res = await labListDept(value)
      deptOptions.value = res.data
      // console.log(111)
      // console.log(options.value)
      deptLoading.value = false
    }, 1000)
  } else {
    deptOptions.value = []
  }
}

// 当选项改变时将userId赋值
const handleChange = (value) => {
  form.userId = toRaw(value).id
}

// 重置
const reset = () => {
  // formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)

// 新增
const onAdd = async () => {
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const res = await getLab(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    // const isInvalid = await formRef.value?.formRef?.validate()
    // const isInvalid = false
    // if (isInvalid) return false
    if (form.deptId === '' || form.userId === '') {
      Message.error('请选择部门或用户')
      return false
    }
    if (isUpdate.value) {
      // console.log(form.userId)
      await updateLab(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addLab(form)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 当选项改变时将实验室id赋值
const deptHandleChange = (value) => {
  form.deptName = toRaw(value).name
  form.deptId = toRaw(value).id
}

defineExpose({ onAdd, onUpdate })
</script>
