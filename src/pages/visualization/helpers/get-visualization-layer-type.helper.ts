export function getVisualizationLayerType(visualizationType: string, favorite: any) {
  return favorite.layer ?
         favorite.layer.indexOf('thematic') !== -1 ?
         'thematic' :
         favorite.layer :
         visualizationType.indexOf('event') !== -1 ?
         'event' :
         'thematic';
}
