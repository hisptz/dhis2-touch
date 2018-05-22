export function checkIfVisualizationIsNonVisualizable(visualizationType: string) {
  return visualizationType === 'USERS' || visualizationType === 'REPORTS' ||
    visualizationType === 'RESOURCES' || visualizationType === 'APP' ||
    visualizationType === 'MESSAGES';
}
