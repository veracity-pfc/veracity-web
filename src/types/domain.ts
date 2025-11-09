export type UUID = string

export enum RiskLabel {
  safe = 'safe',
  suspicious = 'suspicious'
}

export enum AnalysisType {
  url = 'url',
  image = 'image'
}

export interface UrlAnalysisIn {
  url: string
}

export interface UrlAnalysisOut {
  id: UUID
  analysis_id: UUID
  url: string
  label: RiskLabel
  explanation: string
  recommendations: string[]
  created_at?: string
}

export interface ImageAnalysisIn {
  imageUrl?: string
  fileId?: string
}

export interface ImageAnalysisOut {
  id: UUID
  analysis_id: UUID
  label: RiskLabel
  explanation: string
  flags?: string[]
  created_at?: string
}

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
