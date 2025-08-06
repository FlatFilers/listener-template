import type { Flatfile } from '@flatfile/api'

export interface WorkbookMatch {
  existingWorkbook: Flatfile.Workbook
  configIndex: number
}

export interface UnmatchedConfig {
  config: Partial<Flatfile.CreateWorkbookConfig>
  configIndex: number
}

export interface WorkbookMatchResult {
  matches: WorkbookMatch[]
  unmatchedConfigs: UnmatchedConfig[]
  workbooksToDelete: Flatfile.Workbook[]
}

export function matchWorkbooks(
  existingWorkbooks: Flatfile.Workbook[],
  workbookConfigs: Partial<Flatfile.CreateWorkbookConfig>[],
): WorkbookMatchResult {
  const matches: WorkbookMatch[] = []
  const unmatchedConfigs: UnmatchedConfig[] = []
  const workbooksToDelete: Flatfile.Workbook[] = []

  // Track which existing workbooks have been matched
  const matchedWorkbookIds = new Set<string>()

  // Try to match each config to an existing workbook
  workbookConfigs.forEach((config, configIndex) => {
    const matchingWorkbook = existingWorkbooks.find((wb) => wb.name === config.name && !matchedWorkbookIds.has(wb.id))

    if (matchingWorkbook) {
      matches.push({
        existingWorkbook: matchingWorkbook,
        configIndex,
      })
      matchedWorkbookIds.add(matchingWorkbook.id)
    } else {
      unmatchedConfigs.push({
        config,
        configIndex,
      })
    }
  })

  // Any existing workbooks that weren't matched should be deleted
  existingWorkbooks.forEach((workbook) => {
    if (!matchedWorkbookIds.has(workbook.id)) {
      workbooksToDelete.push(workbook)
    }
  })

  return {
    matches,
    unmatchedConfigs,
    workbooksToDelete,
  }
}
