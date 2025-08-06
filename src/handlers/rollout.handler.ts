import api from '@flatfile/api'
import { rollout } from '@flatfile/plugin-rollout'
import { documents } from '../blueprints/documents.config'
import { space as spaceConfig } from '../blueprints/space.config'
import { workbooks } from '../blueprints/workbooks'
import { matchDocuments } from '../utils/document.matching'
import { matchWorkbooks } from '../utils/workbook.matching'

export const rolloutHandler = rollout({
  namespace: '**',
  dev: process.env.NODE_ENV === 'development',
  updater: async (space, existingWorkbooks) => {
    console.log(`Reconfiguring space ${space.id} with full functionality`)

    try {
      // Match workbook configurations to existing workbooks
      const { matches, unmatchedConfigs, workbooksToDelete } = matchWorkbooks(existingWorkbooks, workbooks)

      console.log(
        `Found ${matches.length} workbooks to update, ${unmatchedConfigs.length} to create, ${workbooksToDelete.length} to delete`,
      )

      // Update existing workbooks (this replaces all sheets with new configuration)
      const updatedWorkbookIds = await Promise.all(
        matches.map(async ({ existingWorkbook, configIndex }) => {
          const workbookConfig = workbooks[configIndex]

          // Get existing sheets in the workbook
          const existingSheetsResponse = await api.sheets.list({
            workbookId: existingWorkbook.id,
          })
          const existingSheets = existingSheetsResponse.data

          // Update the workbook with new configuration
          await api.workbooks.update(existingWorkbook.id, {
            environmentId: space.environmentId,
            ...workbookConfig,
          })

          // Delete sheets that are no longer in the configuration
          const newSheetSlugs = new Set(workbookConfig?.sheets?.map((sheet) => sheet.slug) || [])
          for (const existingSheet of existingSheets) {
            if (!newSheetSlugs.has(existingSheet.config.slug)) {
              await api.sheets.delete(existingSheet.id)
            }
          }

          console.log(`Successfully updated workbook ${existingWorkbook.id}`)
          return existingWorkbook.id
        }),
      )

      // Delete workbooks that are no longer in the configuration
      for (const workbookToDelete of workbooksToDelete) {
        await api.workbooks.delete(workbookToDelete.id)
        console.log(`Deleted workbook ${workbookToDelete.id}`)
      }

      // Create new workbooks for unmatched configurations
      const newWorkbookIds = await Promise.all(
        unmatchedConfigs.map(async ({ config }) => {
          const workbook = await api.workbooks.create({
            spaceId: space.id,
            environmentId: space.environmentId,
            name: 'Workbook',
            ...config,
          })
          console.log(`Created new workbook ${workbook.data.id}`)
          return workbook.data.id
        }),
      )

      const allWorkbookIds = [...updatedWorkbookIds, ...newWorkbookIds]

      // Update space configuration
      let spaceUpdateConfig = { ...spaceConfig }

      // Maintain workbook order if configured
      if (allWorkbookIds.length > 0) {
        spaceUpdateConfig = {
          ...spaceUpdateConfig,
          settings: {
            ...spaceUpdateConfig.settings,
            sidebarConfig: {
              ...spaceUpdateConfig.settings?.sidebarConfig,
              workbookSidebarOrder: allWorkbookIds,
            },
          },
          primaryWorkbookId: allWorkbookIds[0],
        }
      }

      await api.spaces.update(space.id, {
        environmentId: space.environmentId,
        ...spaceUpdateConfig,
      })

      console.log('Updated space configuration')

      // Handle documents with full CRUD operations
      if (documents && documents.length > 0) {
        // Fetch existing documents
        const existingDocumentsResponse = await api.documents.list(space.id)
        const existingDocuments = existingDocumentsResponse.data

        // Match documents to configuration
        const {
          matches: documentMatches,
          unmatchedConfigs: newDocuments,
          documentsToDelete,
        } = matchDocuments(existingDocuments, documents)

        // Update existing documents
        for (const { existingDocument, configIndex } of documentMatches) {
          const documentConfig = documents[configIndex]
          if (documentConfig) {
            await api.documents.update(space.id, existingDocument.id, documentConfig)
            console.log(`Updated document ${existingDocument.id}`)
          }
        }

        // Delete documents not in configuration
        for (const documentToDelete of documentsToDelete) {
          await api.documents.delete(space.id, documentToDelete.id)
          console.log(`Deleted document ${documentToDelete.id}`)
        }

        // Create new documents
        for (const { config: newDocumentConfig } of newDocuments) {
          const newDoc = await api.documents.create(space.id, newDocumentConfig)
          console.log(`Created new document ${newDoc.data.id}`)
        }
      } else {
        // If no documents in setup, delete all existing documents
        const existingDocumentsResponse = await api.documents.list(space.id)
        const existingDocuments = existingDocumentsResponse.data

        for (const documentToDelete of existingDocuments) {
          await api.documents.delete(space.id, documentToDelete.id)
          console.log(`Deleted existing document ${documentToDelete.id}`)
        }
      }

      console.log('Space reconfiguration completed successfully')

      // Return only the workbooks that were actually updated for hook re-triggering
      return matches.map((match) => match.existingWorkbook)
    } catch (error) {
      console.error('Error during space reconfiguration:', error)
      throw error
    }
  },
})
