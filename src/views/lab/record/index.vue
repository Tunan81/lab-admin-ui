<template>
  <div class="table-page">
    <GiTable
        row-key="id"
        title="记录管理"
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
        <a-input v-model="queryForm.labId" placeholder="请输入实验室名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-input v-model="queryForm.userId" placeholder="请输入用户名称" allow-clear @change="search">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-date-picker
            v-model="queryForm.inspectionDate"
            placeholder="请选择检查日期"
            format="YYYY-MM-DD"
            style="width: 100%"
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
        <!--        <a-button v-permission="['lab:record:add']" type="primary" @click="onAdd"> -->
        <!--          <template #icon> -->
        <!--            <icon-plus /> -->
        <!--          </template> -->
        <!--          <span>新增</span> -->
        <!--        </a-button> -->
        <a-tooltip content="导出">
          <a-button v-permission="['lab:record:export']" class="gi_hover_btn-border" @click="onExport">
            <template #icon>
              <icon-download />
            </template>
          </a-button>
        </a-tooltip>
      </template>
      <template #labId="{ record }">
        <a-link @click="onDetail(record)">{{ record.labId }}</a-link>
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

    <RecordAddModal ref="RecordAddModalRef" @save-success="search" />
    <RecordDetailDrawer ref="RecordDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import RecordAddModal from './RecordAddModal.vue'
import RecordDetailDrawer from './RecordDetailDrawer.vue'
import { type RecordQuery, type RecordResp, deleteRecord, exportRecord, listRecord } from '@/apis'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { useDict } from '@/hooks/app'

defineOptions({ name: 'Record' })

const queryForm = reactive<RecordQuery>({
  labId: undefined,
  userId: undefined,
  inspectionDate: undefined,
  fireDeviceExist: undefined,
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
  { title: '实验室ID', dataIndex: 'labId', slotName: 'labId' },
  { title: '实验室名称', dataIndex: 'labName', slotName: 'labName' },
  { title: '维护人员ID', dataIndex: 'userId', slotName: 'userId' },
  { title: '维护人员姓名', dataIndex: 'userName', slotName: 'userName' },
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
  queryForm.labId = undefined
  queryForm.userId = undefined
  queryForm.inspectionDate = undefined
  queryForm.fireDeviceExist = undefined
  search()
}

// 删除
const onDelete = (item: RecordResp) => {
  return handleDelete(() => deleteRecord(item.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportRecord(queryForm))
}

const RecordAddModalRef = ref<InstanceType<typeof RecordAddModal>>()
// 新增
const onAdd = () => {
  RecordAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (item: RecordResp) => {
  RecordAddModalRef.value?.onUpdate(item.id)
}

const RecordDetailDrawerRef = ref<InstanceType<typeof RecordDetailDrawer>>()
// 详情
const onDetail = (item: RecordResp) => {
  RecordDetailDrawerRef.value?.onDetail(item.id)
}
</script>

<style lang="scss" scoped></style>
