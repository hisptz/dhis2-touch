const VISUALIZATION_SHAPES: any[] = [
  {
    shape: 'NORMAL',
    shapeClasses: ['col-md-4', 'col-sm-6', 'col-xs-12', 'dashboard-card']
  },
  {
    shape: 'DOUBLE_WIDTH',
    shapeClasses: ['col-md-8', 'col-sm-6', 'col-xs-12', 'dashboard-card']
  },
  {
    shape: 'FULL_WIDTH',
    shapeClasses: ['col-md-12', 'col-sm-12', 'col-xs-12', 'dashboard-card']
  },
];

export function getVisualizationShape(currentShape: string) {

  let newShape = 'NORMAL';
  /**
   * Compute new shape
   */
  if (VISUALIZATION_SHAPES !== undefined && VISUALIZATION_SHAPES.length > 1) {
    VISUALIZATION_SHAPES.forEach((shapeValue, shapeIndex) => {
      if (shapeValue.hasOwnProperty('shape') && shapeValue.shape === currentShape) {
        if (shapeIndex + 1 < VISUALIZATION_SHAPES.length) {
          newShape = VISUALIZATION_SHAPES[shapeIndex + 1].shape;
        }
      }
    });
  }

  return newShape;
}
