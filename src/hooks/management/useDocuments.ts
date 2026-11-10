import { useMemo } from 'react'
import type { User } from '@/types'
import { can } from '@/lib/rbac'
import { selectPendingDocuments } from '@/services/management/documentService'
import { useManagementState } from '@/services/management/store'
import type { PropertyDocument } from '@/types/management'

function byUploadedDesc(a: PropertyDocument, b: PropertyDocument): number {
  return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
}

export function useAllDocuments(): PropertyDocument[] {
  return useManagementState(state => state.documents)
}

export function useViewableDocuments(user: User | null): PropertyDocument[] {
  const documents = useAllDocuments()
  return useMemo(() => documents.filter(doc => can(user, 'document.view', doc)).sort(byUploadedDesc), [documents, user])
}

export function useLeaseDocuments(leaseId: string | undefined): PropertyDocument[] {
  const documents = useAllDocuments()
  return useMemo(() => documents.filter(doc => doc.leaseId === leaseId).sort(byUploadedDesc), [documents, leaseId])
}

export function usePendingDocuments(): PropertyDocument[] {
  const documents = useAllDocuments()
  return useMemo(() => selectPendingDocuments(documents), [documents])
}
