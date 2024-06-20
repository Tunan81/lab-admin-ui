<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { type LabQuery, addRecord, listLabByLoginUser } from '@/apis'
import { useForm, useTable } from '@/hooks'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { isMobile } from '@/utils'
import { useUserStore } from '@/stores'

defineOptions({ name: 'MyLab' })

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

const queryForm = reactive<LabQuery>({
  name: '',
  userName: '',
  buildingName: '',
  deptName: '',
  sort: ['createTime,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable((page) => listLabByLoginUser({ ...queryForm, ...page }), { immediate: true })

const columns: TableInstanceColumns[] = [
  { title: '实验室名称', dataIndex: 'name', slotName: 'name' },
  { title: '所属建筑', dataIndex: 'buildingName', slotName: 'buildingName' },
  { title: '所属部门', dataIndex: 'deptName', slotName: 'deptName' },
  {
    title: '操作',
    slotName: 'action',
    width: 150,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined
    // show: has.hasPermOr(['lab:lab:update', 'lab:lab:delete'])
  }
]

// 重置
const reset = () => {
  queryForm.name = ''
  queryForm.deptName = ''
  queryForm.userName = ''
  queryForm.buildingName = ''
  search()
}

// 新增
const userStore = useUserStore()
const LoginUser = userStore.userInfo

const { form, resetForm } = useForm({
  // todo 待补充
  labName: '',
  userName: LoginUser.username || '',
  userId: LoginUser.id,
  door: 0,
  doerMemo: '',
  inspectionDate: '',
  fireDeviceExist: 0,
  fireDeviceExistMemo: '',
  fireDeviceValid: 0,
  fireDeviceValidMemo: '',
  otherRisks: '',
  problemHandling: '',
  labId: ''
})
const visible = ref(false)

const onAdd = (record) => {
  visible.value = true
  form.labName = record.name
  form.labId = record.id
}

const resetAdd = () => {
  resetForm()
}

const save = async () => {
  try {
    await addRecord(form)
    Message.success('新增成功')
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}
</script>

<template>
  <div class="table-page">
    <GiTable
        row-key="id"
        title="我的实验室"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
        :pagination="pagination"
        :disabled-tools="['size']"
        :disabled-column-keys="['name']"
        @refresh="search"
    >
      <template #custom-left>
        <a-input v-model="queryForm.name" placeholder="请输入实验室名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.deptName" placeholder="请输入所属学院" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.buildingName" placeholder="请输入所属建筑名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-button @click="reset">重置</a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link status="success" @click="onAdd(record)">添加记录</a-link>
<!--          <a-link -->
<!--              v-permission="['lab:lab:delete']" -->
<!--              status="danger" -->
<!--              :disabled="record.disabled" -->
<!--          > -->
<!--            删除 -->
<!--          </a-link> -->
        </a-space>
      </template>
    </GiTable>
  </div>
  <a-modal
      v-model:visible="visible"
      title="添加记录"
      :mask-closable="false"
      :esc-to-close="false"
      :modal-style="{ maxWidth: '600px' }"
      width="90%"
      @before-ok="save"
      @close="resetAdd"
  >
    <a-form :model="form" :auto-label-width="true" layout="horizontal">
      <a-space direction="vertical" :style="{ width: '300px' }" style="margin: 0 auto">
        <a-form-item label="实验室名称" field="labName">
          <a-input v-model="form.labName" placeholder="请输入实验室id" disabled />
        </a-form-item>
        <a-form-item label="门窗状态" field="door" :style="{ width: '300px' }">
          <a-select v-model="form.door" placeholder="请选择门窗状态">
            <a-option :value="0">是</a-option>
            <a-option :value="1">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.door === 1" label="门窗状态情况" field="doorMemo">
          <a-input v-model="form.doerMemo" placeholder="请输入门窗状态情况" />
        </a-form-item>
        <a-form-item label="消防设备是否存在" field="fireDeviceExist" :style="{ width: '300px' }">
          <a-select v-model="form.fireDeviceExist" placeholder="请选择消防设备是否存在">
            <a-option :value="0">是</a-option>
            <a-option :value="1">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.fireDeviceExist === 1" label="消防设备是否存在情况" name="fireDeviceExistMemo">
          <a-input v-model="form.fireDeviceExistMemo" placeholder="请输入消防设备是否存在情况" />
        </a-form-item>
        <a-form-item label="消防设备是否过期" field="fireDeviceValid" :style="{ width: '300px' }">
          <a-select v-model="form.fireDeviceValid" placeholder="请选择消防设备是否过期">
            <a-option :value="0">是</a-option>
            <a-option :value="1">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.fireDeviceValid === 1" label="消防设备过期情况" name="fireDeviceValidMemo">
          <a-input v-model="form.fireDeviceValidMemo" placeholder="请输入消防设备过期情况" />
        </a-form-item>
        <a-form-item label="其他安全隐患" name="otherRisks">
          <a-input v-model="form.otherRisks" placeholder="请输入其他安全隐患" />
        </a-form-item>
        <a-form-item label="问题处理情况" field="problemHandling" :style="{ width: '300px' }">
          <a-select v-model="form.problemHandling" placeholder="请选择问题处理情况">
            <a-option :value="0">未上报</a-option>
            <a-option :value="1">已上报</a-option>
            <a-option :value="2">已处理</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="检查日期" field="fireDeviceValid" :style="{ width: '300px' }">
          <a-date-picker
              v-model="form.inspectionDate"
              placeholder="请选择检查日期"
              format="YYYY-MM-DD"
              style="width: 100%"
          />
        </a-form-item>
      </a-space>
    </a-form>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
