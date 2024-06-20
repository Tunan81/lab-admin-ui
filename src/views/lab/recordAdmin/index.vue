<template>
  <div class="table-page">
    <GiTable
        row-key="id"
        title="我的记录"
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
        <a-input v-model="queryForm.labName" placeholder="请输入实验室名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.userName" placeholder="请输入用户名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-date-picker
            v-model="queryForm.inspectionDate"
            placeholder="请选择检查日期"
            format="YYYY-MM-DD"
            style="width: 100%"
            @change="search"
        />
        <a-select
            v-model="queryForm.fireDeviceExist"
            :options="fire_device_exist_enum"
            placeholder="请选择消防设备是否存在"
            allow-clear
            style="width: 200px"
            @change="search"
        />
        <a-button @click="reset">重置</a-button>
      </template>
      <template #custom-right>
        <a-button v-permission="['lab:record:add']" type="primary" @click="onAdd">
          <template #icon>
            <icon-plus />
          </template>
          <span>新增</span>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['lab:record:update']" @click="onUpdate(record)">修改</a-link>
          <a-link
              v-permission="['lab:record:delete']"
              status="danger"
              :disabled="record.disabled"
              @click="onDelete(record)"
          >
            删除
          </a-link>
        </a-space>
      </template>
      <template #door="{ record }">
        <a-tag v-if="record.door === 0" color="green">是</a-tag>
        <a-tag v-else color="red">否</a-tag>
      </template>
      <template #fireDeviceExist="{ record }">
        <a-tag v-if="record.fireDeviceExist === 0" color="green">是</a-tag>
        <a-tag v-else color="red">否</a-tag>
      </template>
      <template #fireDeviceValid="{ record }">
        <a-tag v-if="record.fireDeviceValid === 0" color="green">是</a-tag>
        <a-tag v-else color="red">否</a-tag>
      </template>
      <template #problemHandling="{ record }">
        <a-tag v-if="record.problemHandling === 0" color="red">未上报</a-tag>
        <a-tag v-else-if="record.problemHandling === 1" color="orange">已上报</a-tag>
        <a-tag v-else color="green">已处理</a-tag>
      </template>
    </GiTable>
    <LabAdminRecordAddModal ref="RecordAddModalRef" :user-info="userStore.userInfo" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import { type RecordQuery, type RecordResp, deleteRecord, listRecord } from '@/apis'
import { useDict } from '@/hooks/app'
import { useTable } from '@/hooks'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useUserStore } from '@/stores'
import LabAdminRecordAddModal from '@/views/lab/recordAdmin/LabAdminRecordAddModal.vue'

defineOptions({ name: 'MyRecord' })

const queryForm = reactive<RecordQuery>({
  labId: '',
  userId: '',
  userName: '',
  labName: '',
  inspectionDate: '',
  fireDeviceExist: '',
  sort: ['createTime,desc']
})

const { fire_device_exist_enum } = useDict('fire_device_exist_enum')

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listRecord({ ...queryForm, ...page }), { immediate: true })

const columns: TableInstanceColumns[] = [
  { title: '实验室名称', dataIndex: 'labName', slotName: 'labName' },
  { title: '门窗完好及关闭', dataIndex: 'door', slotName: 'door' },
  { title: '门窗完好及关闭情况', dataIndex: 'doorMemo', slotName: 'doorMemo' },
  { title: '消防设备是否存在', dataIndex: 'fireDeviceExist', slotName: 'fireDeviceExist' },
  { title: '消防设备是否存在情况', dataIndex: 'fireDeviceExistMemo', slotName: 'fireDeviceExistMemo' },
  { title: '消防设施是否有效', dataIndex: 'fireDeviceValid', slotName: 'fireDeviceValid' },
  { title: '消防设施是否有效情况', dataIndex: 'fireDeviceValidMemo', slotName: 'fireDeviceValidMemo' },
  { title: '其他安全隐患', dataIndex: 'otherRisks', slotName: 'otherRisks' },
  { title: '问题处理情况', dataIndex: 'problemHandling', slotName: 'problemHandling' },
  { title: '检查日期', dataIndex: 'inspectionDate', slotName: 'inspectionDate' },
  {
    title: '操作',
    slotName: 'action',
    width: 130,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['lab:record:update', 'lab:record:delete'])
  }
]

// 重置
const reset = () => {
  queryForm.labId = ''
  queryForm.userId = ''
  queryForm.userName = ''
  queryForm.labName = ''
  queryForm.inspectionDate = ''
  queryForm.fireDeviceExist = ''
  search()
}

// 删除
const onDelete = (item: RecordResp) => {
  return handleDelete(() => deleteRecord(item.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

const RecordAddModalRef = ref<InstanceType<typeof LabAdminRecordAddModal>>()

const onAdd = () => {
  RecordAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (item: RecordResp) => {
  RecordAddModalRef.value?.onUpdate(item.id)
}

const userStore = useUserStore()
</script>

<style scoped lang="scss">

</style>
