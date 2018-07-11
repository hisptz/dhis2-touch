// Utils for thematic mapping
import { format, precisionRound } from 'd3-format';
import * as _ from 'lodash';
import {
  CLASSIFICATION_EQUAL_INTERVALS,
  CLASSIFICATION_EQUAL_COUNTS
} from '../constants/layer.constant';

export const classify = (features, options) => {
  const { method, classes, colorScale } = options;
  const values = features.map(feature => Number(feature.properties.value)).sort((a, b) => a - b);
  const bins = getClassBins(values, method, classes);
  const getClassIndex = _.curryRight(getClass)(bins);

  if (bins.length) {
    features.forEach(feature => {
      feature.properties.color = colorScale[getClassIndex(feature.properties.value) - 1];
    });
  }
};

// Returns legend item where a value belongs
export const getLegendItemForValue = (legendItems, value) => {
  const isLast = index => index === legendItems.length - 1;
  return legendItems.find(
    (item, index) =>
      value >= item.startValue &&
      (value < item.endValue || (isLast(index) && value === item.endValue))
  );
};

export const getLegendItems = (values, method, numClasses) => {
  const minValue = values[0];
  const maxValue = values[values.length - 1];
  let bins;

  if (method === CLASSIFICATION_EQUAL_INTERVALS) {
    bins = getEqualIntervals(minValue, maxValue, numClasses);
  } else if (method === CLASSIFICATION_EQUAL_COUNTS) {
    bins = getQuantiles(values, numClasses);
  }

  return bins;
};

export const getClassBins = (values, method, numClasses) => {
  const minValue = values[0];
  const maxValue = values[values.length - 1];
  let bins;

  if (method === CLASSIFICATION_EQUAL_INTERVALS) {
    bins = getEqualIntervals(minValue, maxValue, numClasses);
  } else if (method === CLASSIFICATION_EQUAL_COUNTS) {
    bins = getQuantiles(values, numClasses);
  }

  return bins;
};

export const getEqualIntervals = (minValue, maxValue, numClasses) => {
  const bins = [];
  const binSize = (maxValue - minValue) / numClasses;
  const precision = precisionRound(binSize, maxValue);

  const valueFormat = format(`.${precision}f`);

  for (let i = 0; i < numClasses; i++) {
    const startValue = minValue + i * binSize;
    const endValue = i < numClasses - 1 ? startValue + binSize : maxValue;

    bins.push({
      startValue: Number(valueFormat(startValue)),
      endValue: Number(valueFormat(endValue))
    });
  }

  return bins;
};

export const getQuantiles = (values, numClasses) => {
  const minValue = values[0];
  const maxValue = values[values.length - 1];
  const bins = [];
  const binCount = values.length / numClasses;
  const precision = precisionRound((maxValue - minValue) / numClasses, maxValue);
  const valueFormat = format(`.${precision}f`);

  let binLastValPos = binCount === 0 ? 0 : binCount;

  if (values.length > 0) {
    bins[0] = minValue;
    for (let i = 1; i < numClasses; i++) {
      bins[i] = values[Math.round(binLastValPos)];
      binLastValPos += binCount;
    }
  }

  // bin can be undefined if few values
  return bins.filter(bin => bin !== undefined).map((value, index) => ({
    startValue: Number(valueFormat(value)),
    endValue: Number(valueFormat(bins[index + 1] || maxValue))
  }));
};

// Returns class number
export const getClass = (value, bins) => {
  if (value >= bins[0]) {
    for (let i = 1; i < bins.length; i++) {
      if (value < bins[i]) {
        return i;
      }
    }

    // If value is the highest number, use the last bin index
    if (value === bins[bins.length - 1]) {
      return bins.length - 1;
    }
  }

  return null;
};

export function getColorsByRgbInterpolation(firstColor, lastColor, nbColors) {
  const colors = [];
  const colorA = hexToRgb('#' + firstColor);
  const colorB = hexToRgb('#' + lastColor);

  if (nbColors === 1) {
    return ['#' + firstColor];
  }
  for (let i = 0; i < nbColors; i++) {
    colors.push(
      rgbToHex({
        r: parseInt((colorA.r + i * (colorB.r - colorA.r) / (nbColors - 1)).toString(), 10),
        g: parseInt((colorA.g + i * (colorB.g - colorA.g) / (nbColors - 1)).toString(), 10),
        b: parseInt((colorA.b + i * (colorB.b - colorA.b) / (nbColors - 1)).toString(), 10)
      })
    );
  }
  return colors;
}

// Convert hex color to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Convert RGB color to hex
export function rgbToHex(rgb) {
  return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1); // tslint:disable-line
}
