export function getGeoFeatureUrl(orgUnitFilterValue: any) {
  const  geoFeatureParams = getGeoFeatureParams(orgUnitFilterValue);
  return geoFeatureParams !== '' ?
    'geoFeatures.json?' + geoFeatureParams + '&displayProperty=NAME&includeGroupSets=true' : '';
}


function getGeoFeatureParams(orgUnitFilterValue: any) {
  return orgUnitFilterValue !== '' ? 'ou=ou:' + orgUnitFilterValue : '';
}
