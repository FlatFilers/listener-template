import type { Flatfile } from '@flatfile/api'

export interface DocumentMatch {
  existingDocument: Flatfile.Document
  configIndex: number
}

export interface UnmatchedDocumentConfig {
  config: Flatfile.DocumentConfig
  configIndex: number
}

export interface DocumentMatchResult {
  matches: DocumentMatch[]
  unmatchedConfigs: UnmatchedDocumentConfig[]
  documentsToDelete: Flatfile.Document[]
}

export function matchDocuments(
  existingDocuments: Flatfile.Document[],
  documentConfigs: Flatfile.DocumentConfig[],
): DocumentMatchResult {
  const matches: DocumentMatch[] = []
  const unmatchedConfigs: UnmatchedDocumentConfig[] = []
  const documentsToDelete: Flatfile.Document[] = []

  // Track which existing documents have been matched
  const matchedDocumentIds = new Set<string>()

  // Try to match each config to an existing document
  documentConfigs.forEach((config, configIndex) => {
    const matchingDocument = existingDocuments.find(
      (doc) => doc.title === config.title && !matchedDocumentIds.has(doc.id),
    )

    if (matchingDocument) {
      matches.push({
        existingDocument: matchingDocument,
        configIndex,
      })
      matchedDocumentIds.add(matchingDocument.id)
    } else {
      unmatchedConfigs.push({
        config,
        configIndex,
      })
    }
  })

  // Any existing documents that weren't matched should be deleted
  existingDocuments.forEach((document) => {
    if (!matchedDocumentIds.has(document.id)) {
      documentsToDelete.push(document)
    }
  })

  return {
    matches,
    unmatchedConfigs,
    documentsToDelete,
  }
}
