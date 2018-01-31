export function getVisualizationFavoriteUrl(visualizationFavorite: any): string {
  if (!visualizationFavorite || !visualizationFavorite.type || !visualizationFavorite.id) {
    return '';
  }

  let url: string = visualizationFavorite.type + 's/' + visualizationFavorite.id + '.json?fields=';
  if (visualizationFavorite.type === 'map') {
    url += 'id,user,displayName,longitude,latitude,zoom,basemap,mapViews[*,organisationUnitGroupSet[id,name,displayName,organisationUnitGroups[id,code,name,shortName,displayName,dimensionItem,symbol,organisationUnits[id,code,name,shortName]]],dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name,code]]]],columns[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],dataDimensionItems,program[id,displayName],programStage[id,displayName],legendSet[id,displayName,legends[*]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]';
  } else {
    url += '*,interpretations[id,type,text,created,likes,likedBy[id,name],user[id,name],comments[id,created,text,user[id,name]],eventReport[id,name],eventChart[id,name],chart[id,name],map[id,name,mapViews[id,name]],reportTable[id,name]],dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name,code]]]],displayDescription,program[id,name],programStage[id,name],legendSet[*,legends[*]],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits';
  }

  return url;
}
