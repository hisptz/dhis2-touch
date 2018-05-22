export function getVisualizationWidthFromShape(dashboardItemShape: string): string {
  switch (dashboardItemShape) {
    case 'DOUBLE_WIDTH':
      return 'span 2';
    case 'FULL_WIDTH':
      return 'span 3';
    default:
      return 'auto';
  }
}
