import { chaosRequest as request } from '@atlas/shared'

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
    request.get<EmailTemplate[]>('/templates', {
      params: serviceId ? { service_id: serviceId } : undefined,
    }),
  getDetail: (templateId: string) => request.get<EmailTemplate>(`/templates/${templateId}`),
  create: (data: TemplateCreateRequest) => request.post<EmailTemplate>('/templates', data),
  update: (templateId: string, data: TemplateUpdateRequest) =>
    request.patch(`/templates/${templateId}`, data),
  delete: (templateId: string) => request.delete(`/templates/${templateId}`),
  render: (templateId: string, data: Record<string, unknown>) =>
    request.post<RenderResponse>(`/templates/${templateId}/render`, { data }),
}

export const chaosMailApi = {
  send: (data: SendMailRequest) => request.post('/mail', data),
}
