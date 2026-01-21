/**
 * Hermes 身份与访问管理 API 服务
 */

import { get, post, put, del } from '@/utils/request'
import type {
  Domain,
  Service,
  Application,
  Relationship,
  Group,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
  ApplicationServiceRelationRequest,
  RelationshipCreateRequest,
  RelationshipUpdateRequest,
  RelationshipDeleteRequest,
  GroupCreateRequest,
  GroupUpdateRequest,
  GroupMemberRequest,
  ApplicationServiceRelation,
} from '@/types/hermes'

// ==================== Domain 相关 ====================

/**
 * 获取域列表
 */
export async function listDomains(): Promise<Domain[]> {
  return get<Domain[]>('/hermes/domains')
}

/**
 * 获取域详情
 */
export async function getDomain(domainId: string): Promise<Domain> {
  return get<Domain>(`/hermes/domains/${domainId}`)
}

// ==================== Service 相关 ====================

/**
 * 获取服务列表
 */
export async function listServices(domainId?: string): Promise<Service[]> {
  return get<Service[]>('/hermes/services', { domain_id: domainId })
}

/**
 * 获取服务详情
 */
export async function getService(serviceId: string): Promise<Service> {
  return get<Service>(`/hermes/services/${serviceId}`)
}

/**
 * 创建服务
 */
export async function createService(data: ServiceCreateRequest): Promise<Service> {
  return post<Service>('/hermes/services', data)
}

/**
 * 更新服务
 */
export async function updateService(serviceId: string, data: ServiceUpdateRequest): Promise<{ message: string }> {
  return put<{ message: string }>(`/hermes/services/${serviceId}`, data)
}

// ==================== Application 相关 ====================

/**
 * 获取应用列表
 */
export async function listApplications(domainId?: string): Promise<Application[]> {
  return get<Application[]>('/hermes/applications', { domain_id: domainId })
}

/**
 * 获取应用详情
 */
export async function getApplication(appId: string): Promise<Application> {
  return get<Application>(`/hermes/applications/${appId}`)
}

/**
 * 创建应用
 */
export async function createApplication(data: ApplicationCreateRequest): Promise<Application> {
  return post<Application>('/hermes/applications', data)
}

/**
 * 更新应用
 */
export async function updateApplication(appId: string, data: ApplicationUpdateRequest): Promise<{ message: string }> {
  return put<{ message: string }>(`/hermes/applications/${appId}`, data)
}

/**
 * 获取应用可访问的服务关系
 */
export async function getApplicationServiceRelations(appId: string): Promise<ApplicationServiceRelation[]> {
  return get<ApplicationServiceRelation[]>(`/hermes/applications/${appId}/applicable`)
}

/**
 * 设置应用服务关系
 */
export async function setApplicationServiceRelations(
  appId: string,
  serviceId: string,
  data: ApplicationServiceRelationRequest
): Promise<{ message: string }> {
  return post<{ message: string }>(`/hermes/applications/${appId}/services/${serviceId}/applicable`, data)
}

// ==================== Relationship 相关 ====================

/**
 * 获取关系列表
 */
export async function listRelationships(params?: {
  service_id?: string
  subject_type?: string
  subject_id?: string
}): Promise<Relationship[]> {
  return get<Relationship[]>('/hermes/relationships', params)
}

/**
 * 创建关系
 */
export async function createRelationship(data: RelationshipCreateRequest): Promise<Relationship> {
  return post<Relationship>('/hermes/relationships', data)
}

/**
 * 更新关系
 */
export async function updateRelationship(data: RelationshipUpdateRequest): Promise<Relationship> {
  return put<Relationship>('/hermes/relationships', data)
}

/**
 * 删除关系
 */
export async function deleteRelationship(data: RelationshipDeleteRequest): Promise<{ message: string }> {
  return del<{ message: string }>('/hermes/relationships', data)
}

// ==================== Group 相关 ====================

/**
 * 获取组列表
 */
export async function listGroups(): Promise<Group[]> {
  return get<Group[]>('/hermes/groups')
}

/**
 * 获取组详情
 */
export async function getGroup(groupId: string): Promise<Group> {
  return get<Group>(`/hermes/groups/${groupId}`)
}

/**
 * 创建组
 */
export async function createGroup(data: GroupCreateRequest): Promise<Group> {
  return post<Group>('/hermes/groups', data)
}

/**
 * 更新组
 */
export async function updateGroup(groupId: string, data: GroupUpdateRequest): Promise<{ message: string }> {
  return put<{ message: string }>(`/hermes/groups/${groupId}`, data)
}

/**
 * 获取组成员
 */
export async function getGroupMembers(groupId: string): Promise<{ members: string[] }> {
  return get<{ members: string[] }>(`/hermes/groups/${groupId}/members`)
}

/**
 * 设置组成员
 */
export async function setGroupMembers(data: GroupMemberRequest): Promise<{ message: string }> {
  return post<{ message: string }>(`/hermes/groups/${data.group_id}/members`, data)
}
