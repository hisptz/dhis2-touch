export function getStandardizedVisualizationType(visualizationType: string): string {
  return (visualizationType === 'CHART' || visualizationType === 'EVENT_CHART') ?
         'CHART' :
         (
           visualizationType === 'TABLE' ||
           visualizationType === 'EVENT_REPORT' ||
           visualizationType === 'REPORT_TABLE'
         ) ?
         'TABLE' :
         (visualizationType === 'MAP') ?
         'MAP' :
         visualizationType;
}
