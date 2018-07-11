import { MapConfiguration } from '../models/map-configuration.model';

export function refineHeight(mapHeight) {
  let height = '';
  if (mapHeight.indexOf('vh') >= 0) {
    const splitMap = mapHeight.split('vh');
    height = +splitMap[0] + 2 + 'vh';
  }

  if (mapHeight.indexOf('px') >= 0) {
    const splitMap = mapHeight.split('px');
    height = +splitMap[0] + 15 + 'px';
  }
  return height;
}

export function prepareMapContainer(mapObjectId, height, width, isFullscreen) {
  const parentElement = document.getElementById('map-view-port-' + mapObjectId);
  const mapContainer = document.getElementById(mapObjectId + '-child-view-port');
  if (mapContainer) {
    mapContainer.parentNode.removeChild(mapContainer);
  }
  const div = document.createElement('div');
  div.setAttribute('id', mapObjectId + '-child-view-port');
  if (isFullscreen) {
    width = '100%';
  }
  div.style.width = width;
  div.style.height = height;
  div.style.background = '#FCFAF8';
  if (parentElement) {
    parentElement.appendChild(div);
  }
  return mapObjectId + '-child-view-port';
}
