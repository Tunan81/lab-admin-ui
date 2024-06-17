import http from '@/utils/http'

const BASE_URL = '/lab/record'

export interface RecordResp {
  id: string
  labId: string
  userId: string
  inspectionDate: string
  door: string
  doorMemo: string
  fireDeviceExist: string
  fireDeviceExistMemo: string
  fireDeviceValid: string
  fireDeviceValidMemo: string
  otherRisks: string
  problemHandling: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface RecordDetailResp {
  id: string
  labId: string
  userId: string
  inspectionDate: string
  door: string
  doorMemo: string
  fireDeviceExist: string
  fireDeviceExistMemo: string
  fireDeviceValid: string
  fireDeviceValidMemo: string
  otherRisks: string
  problemHandling: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface RecordQuery {
  labId: string
  userId: string
  inspectionDate: string
  fireDeviceExist: string
  sort: Array<string>
}
export interface RecordPageQuery extends RecordQuery, PageQuery {}

/** @desc 查询记录管理列表 */
export function listRecord(query: RecordPageQuery) {
  return http.get<PageRes<RecordResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询记录管理详情 */
export function getRecord(id: string) {
  return http.get<RecordDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增记录管理 */
export function addRecord(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改记录管理 */
export function updateRecord(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除记录管理 */
export function deleteRecord(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出记录管理 */
export function exportRecord(query: RecordQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}
