import { get, post, put, del, patch } from '@/utils/request'
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
    get<MiniprogramListResponse>('/miniprogram', params as unknown as Record<string, unknown>),

  getDetail: (id: string) => get<Miniprogram>(`/miniprogram/${id}`),

  create: (data: Partial<Miniprogram>) => post<Miniprogram>('/miniprogram', data),

  update: (id: string, data: Partial<Miniprogram>) => put<Miniprogram>(`/miniprogram/${id}`, data),

  delete: (id: string) => del<void>(`/miniprogram/${id}`),

  publish: (id: string) => post<Miniprogram>(`/miniprogram/${id}/publish`),
}

export const tenantApi = {
  getList: () => get('/tenants'),

  getDetail: (id: string) => get(`/tenants/${id}`),

  create: (data: Record<string, unknown>) => post('/tenants', data),

  update: (id: string, data: Record<string, unknown>) => put(`/tenants/${id}`, data),

  delete: (id: string) => del(`/tenants/${id}`),
}

export const domainApi = {
  getList: () => get<Domain[]>('/hermes/domains'),

  getDetail: (domainId: string) => get<Domain>(`/hermes/domains/${domainId}`),
}

export const serviceApi = {
  getList: (params?: ListServicesParams) =>
    get<Service[]>('/hermes/services', params as Record<string, unknown>),

  getDetail: (serviceId: string) => get<Service>(`/hermes/services/${serviceId}`),

  create: (data: ServiceCreateRequest) => post<Service>('/hermes/services', data),

  update: (serviceId: string, data: ServiceUpdateRequest) =>
    patch(`/hermes/services/${serviceId}`, data),
}

export const applicationApi = {
  getList: (params?: ListApplicationsParams) =>
    get<Application[]>('/hermes/applications', params as Record<string, unknown>),

  getDetail: (appId: string) => get<Application>(`/hermes/applications/${appId}`),

  create: (data: ApplicationCreateRequest) => post<Application>('/hermes/applications', data),

  update: (appId: string, data: ApplicationUpdateRequest) =>
    patch(`/hermes/applications/${appId}`, data),

  setServiceRelations: (
    appId: string,
    serviceId: string,
    data: ApplicationServiceRelationRequest
  ) => post(`/hermes/applications/${appId}/services/${serviceId}/applicable`, data),

  getServiceRelations: (appId: string) =>
    get<ApplicationServiceRelation[]>(`/hermes/applications/${appId}/applicable`),
}

export const relationshipApi = {
  getList: (params?: ListRelationshipsParams) =>
    get<Relationship[]>('/hermes/relationships', params as Record<string, unknown>),

  create: (data: RelationshipCreateRequest) => post<Relationship>('/hermes/relationships', data),

  delete: (data: RelationshipDeleteRequest) => del('/hermes/relationships', data),
}

export const groupApi = {
  getList: () => get<Group[]>('/hermes/groups'),

  getDetail: (groupId: string) => get<Group>(`/hermes/groups/${groupId}`),

  create: (data: GroupCreateRequest) => post<Group>('/hermes/groups', data),

  update: (groupId: string, data: GroupUpdateRequest) => patch(`/hermes/groups/${groupId}`, data),

  setMembers: (groupId: string, data: GroupMemberRequest) =>
    post(`/hermes/groups/${groupId}/members`, data),

  getMembers: (groupId: string) => get<{ members: string[] }>(`/hermes/groups/${groupId}/members`),
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
    get<EmailTemplate[]>('/chaos/templates', serviceId ? { service_id: serviceId } : undefined),

  getDetail: (templateId: string) => get<EmailTemplate>(`/chaos/templates/${templateId}`),

  create: (data: TemplateCreateRequest) => post<EmailTemplate>('/chaos/templates', data),

  update: (templateId: string, data: TemplateUpdateRequest) =>
    patch(`/chaos/templates/${templateId}`, data),

  delete: (templateId: string) => del(`/chaos/templates/${templateId}`),

  render: (templateId: string, data: Record<string, unknown>) =>
    post<RenderResponse>(`/chaos/templates/${templateId}/render`, { data }),
}

// chaosFileApi 暂时移除，等 Worker 方案确定后再实现
// 上传功能通过 antd Upload 组件直接 POST /chaos/files

export const chaosMailApi = {
  send: (data: SendMailRequest) => post('/chaos/mail', data),
}
