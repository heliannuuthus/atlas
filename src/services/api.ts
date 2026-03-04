import request from '@/utils/request'
import type {
  Miniprogram,
  MiniprogramListParams,
  MiniprogramListResponse,
} from '@/types/miniprogram'
import type {
  Domain,
  Service,
  Application,
  ApplicationServiceRelation,
  Relationship,
  Group,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
  ApplicationServiceRelationRequest,
  RelationshipCreateRequest,
  RelationshipDeleteRequest,
  GroupCreateRequest,
  GroupUpdateRequest,
  GroupMemberRequest,
  ListServicesParams,
  ListApplicationsParams,
  ListRelationshipsParams,
} from '@/types/management'

export const miniprogramApi = {
  getList: (params: MiniprogramListParams) =>
    request.get<MiniprogramListResponse>('/miniprogram', { params }),

  getDetail: (id: string) =>
    request.get<Miniprogram>(`/miniprogram/${id}`),

  create: (data: Partial<Miniprogram>) =>
    request.post<Miniprogram>('/miniprogram', data),

  update: (id: string, data: Partial<Miniprogram>) =>
    request.put<Miniprogram>(`/miniprogram/${id}`, data),

  delete: (id: string) =>
    request.delete<void>(`/miniprogram/${id}`),

  publish: (id: string) =>
    request.post<Miniprogram>(`/miniprogram/${id}/publish`),
}

export const tenantApi = {
  getList: () => request.get('/tenants'),

  getDetail: (id: string) => request.get(`/tenants/${id}`),

  create: (data: Record<string, unknown>) =>
    request.post('/tenants', data),

  update: (id: string, data: Record<string, unknown>) =>
    request.put(`/tenants/${id}`, data),

  delete: (id: string) => request.delete(`/tenants/${id}`),
}

export const domainApi = {
  getList: () => request.get<Domain[]>('/hermes/domains'),

  getDetail: (domainId: string) =>
    request.get<Domain>(`/hermes/domains/${domainId}`),
}

export const serviceApi = {
  getList: (params?: ListServicesParams) =>
    request.get<Service[]>('/hermes/services', { params }),

  getDetail: (serviceId: string) =>
    request.get<Service>(`/hermes/services/${serviceId}`),

  create: (data: ServiceCreateRequest) =>
    request.post<Service>('/hermes/services', data),

  update: (serviceId: string, data: ServiceUpdateRequest) =>
    request.patch(`/hermes/services/${serviceId}`, data),
}

export const applicationApi = {
  getList: (params?: ListApplicationsParams) =>
    request.get<Application[]>('/hermes/applications', { params }),

  getDetail: (appId: string) =>
    request.get<Application>(`/hermes/applications/${appId}`),

  create: (data: ApplicationCreateRequest) =>
    request.post<Application>('/hermes/applications', data),

  update: (appId: string, data: ApplicationUpdateRequest) =>
    request.patch(`/hermes/applications/${appId}`, data),

  setServiceRelations: (
    appId: string,
    serviceId: string,
    data: ApplicationServiceRelationRequest
  ) =>
    request.post(
      `/hermes/applications/${appId}/services/${serviceId}/applicable`,
      data
    ),

  getServiceRelations: (appId: string) =>
    request.get<ApplicationServiceRelation[]>(
      `/hermes/applications/${appId}/applicable`
    ),
}

export const relationshipApi = {
  getList: (params?: ListRelationshipsParams) =>
    request.get<Relationship[]>('/hermes/relationships', { params }),

  create: (data: RelationshipCreateRequest) =>
    request.post<Relationship>('/hermes/relationships', data),

  delete: (data: RelationshipDeleteRequest) =>
    request.delete('/hermes/relationships', { data }),
}

export const groupApi = {
  getList: () => request.get<Group[]>('/hermes/groups'),

  getDetail: (groupId: string) =>
    request.get<Group>(`/hermes/groups/${groupId}`),

  create: (data: GroupCreateRequest) =>
    request.post<Group>('/hermes/groups', data),

  update: (groupId: string, data: GroupUpdateRequest) =>
    request.patch(`/hermes/groups/${groupId}`, data),

  setMembers: (groupId: string, data: GroupMemberRequest) =>
    request.post(`/hermes/groups/${groupId}/members`, data),

  getMembers: (groupId: string) =>
    request.get<{ members: string[] }>(`/hermes/groups/${groupId}/members`),
}

// ==================== Chaos API ====================

export interface EmailTemplate {
  template_id: string
  name: string
  description?: string
  subject: string
  content: string
  type: string
  variables?: string
  service_id?: string
  is_builtin: boolean
  is_enabled: boolean
  created_at: string
  updated_at: string
}

// 上传结果（POST /chaos/files 返回）
export interface FileUploadResult {
  key: string
  file_name: string
  file_size: number
  content_type: string
  public_url: string
}

export interface SendMailRequest {
  to: string
  subject?: string
  template_id: string
  data?: Record<string, unknown>
}

export interface TemplateCreateRequest {
  template_id: string
  name: string
  description?: string
  subject: string
  content: string
  variables?: string
  service_id?: string
}

export interface TemplateUpdateRequest {
  name?: string
  description?: string
  subject?: string
  content?: string
  variables?: string
  is_enabled?: boolean
}

export interface RenderResponse {
  subject: string
  body: string
}

export const chaosTemplateApi = {
  getList: (serviceId?: string) =>
    request.get<EmailTemplate[]>('/chaos/templates', {
      params: serviceId ? { service_id: serviceId } : undefined,
    }),

  getDetail: (templateId: string) =>
    request.get<EmailTemplate>(`/chaos/templates/${templateId}`),

  create: (data: TemplateCreateRequest) =>
    request.post<EmailTemplate>('/chaos/templates', data),

  update: (templateId: string, data: TemplateUpdateRequest) =>
    request.patch(`/chaos/templates/${templateId}`, data),

  delete: (templateId: string) =>
    request.delete(`/chaos/templates/${templateId}`),

  render: (templateId: string, data: Record<string, unknown>) =>
    request.post<RenderResponse>(`/chaos/templates/${templateId}/render`, { data }),
}

// chaosFileApi 暂时移除，等 Worker 方案确定后再实现
// 上传功能通过 antd Upload 组件直接 POST /chaos/files

export const chaosMailApi = {
  send: (data: SendMailRequest) =>
    request.post('/chaos/mail', data),
}
