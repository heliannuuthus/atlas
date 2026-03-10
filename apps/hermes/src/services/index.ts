import { hermesRequest as request } from '@atlas/shared'
import type {
  Domain,
  Service,
  Application,
  ApplicationServiceRelation,
  ServiceApplicationRelation,
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
} from '@/types'

const hermes = '/hermes'

export const domainApi = {
  getList: () => request.get<Domain[]>(`${hermes}/domains`),
  getDetail: (domainId: string) => request.get<Domain>(`${hermes}/domains/${domainId}`),
}

export const serviceApi = {
  getList: (domainId: string, params?: { service_id?: string; name?: string }) =>
    request.get<Service[]>(`${hermes}/domains/${domainId}/services`, { params }),
  getDetail: (domainId: string, serviceId: string) =>
    request.get<Service>(`${hermes}/domains/${domainId}/services/${serviceId}`),
  /** 服务侧：该服务已授权给哪些应用及授予的权限（ReBAC） */
  getApplicationRelations: (domainId: string, serviceId: string) =>
    request.get<ServiceApplicationRelation[]>(`${hermes}/domains/${domainId}/services/${serviceId}/applications`),
  /** 某服务授予某应用的关系列表 */
  getServiceAppRelations: (domainId: string, serviceId: string, appId: string) =>
    request.get<{ relations: string[] }>(`${hermes}/domains/${domainId}/services/${serviceId}/applications/${appId}/relations`),
  /** 设置某服务授予某应用的关系 */
  setServiceAppRelations: (domainId: string, serviceId: string, appId: string, relations: string[]) =>
    request.put(`${hermes}/domains/${domainId}/services/${serviceId}/applications/${appId}/relations`, { relations }),
  create: (domainId: string, data: Omit<ServiceCreateRequest, 'domain_id'>) =>
    request.post<Service>(`${hermes}/domains/${domainId}/services`, data),
  update: (domainId: string, serviceId: string, data: ServiceUpdateRequest) =>
    request.patch(`${hermes}/domains/${domainId}/services/${serviceId}`, data),
  delete: (domainId: string, serviceId: string) =>
    request.delete(`${hermes}/domains/${domainId}/services/${serviceId}`),
}

export const applicationApi = {
  getList: (domainId: string) =>
    request.get<Application[]>(`${hermes}/domains/${domainId}/applications`),
  getDetail: (domainId: string, appId: string) =>
    request.get<Application>(`${hermes}/domains/${domainId}/applications/${appId}`),
  create: (domainId: string, data: Omit<ApplicationCreateRequest, 'domain_id'>) =>
    request.post<Application>(`${hermes}/domains/${domainId}/applications`, data),
  update: (domainId: string, appId: string, data: ApplicationUpdateRequest) =>
    request.patch(`${hermes}/domains/${domainId}/applications/${appId}`, data),
  /** 该应用在各服务下被授予的权限（按服务聚合） */
  getServiceRelations: (domainId: string, appId: string) =>
    request.get<ApplicationServiceRelation[]>(`${hermes}/domains/${domainId}/applications/${appId}/relations`),
}

export const relationshipApi = {
  getList: (params?: { service_id?: string; subject_type?: string; subject_id?: string }) =>
    request.get<Relationship[]>('/relationships', { params }),
  create: (data: RelationshipCreateRequest) => request.post<Relationship>('/relationships', data),
  delete: (data: RelationshipDeleteRequest) => request.delete('/relationships', { data }),
}

export const groupApi = {
  getList: () => request.get<Group[]>('/groups'),
  getDetail: (groupId: string) => request.get<Group>(`/groups/${groupId}`),
  create: (data: GroupCreateRequest) => request.post<Group>('/groups', data),
  update: (groupId: string, data: GroupUpdateRequest) => request.patch(`/groups/${groupId}`, data),
  setMembers: (groupId: string, data: GroupMemberRequest) =>
    request.post(`/groups/${groupId}/members`, data),
  getMembers: (groupId: string) => request.get<{ members: string[] }>(`/groups/${groupId}/members`),
}
