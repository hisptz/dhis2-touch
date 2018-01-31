import * as _ from 'lodash';
export function getSplitedAnalytics(analytics: any, splitCriteria: any[]) {
  const analyticsArray: any[] = [];
  const analyticHeaders: any[] = analytics.headers;
  let analyticsMetadata: any[] = [];

  /**
   * split metadata based on dimension selected
   */
  if (analytics.metaData) {
    analyticsMetadata = [analytics.metaData];
    splitCriteria.forEach(criteria => {
      analyticsMetadata = splitAnalyticsMetadata(analyticsMetadata, criteria);
    });
  }

  /**
   * split the corresponding rows
   */
  if (analyticsMetadata.length > 0) {
    analyticsMetadata.forEach((metadata: any) => {
      let rows: any[] = analytics.rows;
      const metadataNames: any = {};
      const newMetadata: any = _.clone(metadata);
      if (rows.length > 0) {
        splitCriteria.forEach(criteria => {
          const rowIndex = _.findIndex(analyticHeaders, ['name', criteria]);
          const id = metadata[criteria][0];
          rows = this.splitAnalyticsRows(rows, id, rowIndex);

          /**
           * Get names
           */
          const headersNameArray = analyticHeaders.map(header => {
            return header.name;
          });

          headersNameArray.forEach(headerName => {
            metadataNames[headerName] = metadata.names[headerName];
            if (metadata[headerName]) {
              metadata[headerName].forEach(metadataName => {
                metadataNames[metadataName] = metadata.names[metadataName];
              });
            }
          });

          metadata[criteria].forEach(metadataCriteria => {
            metadataNames[metadataCriteria] = metadata.names[metadataCriteria];
          });

          newMetadata.names = metadataNames;
        });
      }

      analyticsArray.push({
        headers: analyticHeaders,
        metaData: newMetadata,
        rows: rows
      });
    });
  }


  return analyticsArray;
}

function splitAnalyticsMetadata(analyticsMetadataArray, splitDimension): any {
  const metadataArray: any[] = [];
  if (analyticsMetadataArray) {
    analyticsMetadataArray.forEach(metadata => {
      if (metadata[splitDimension]) {
        metadata[splitDimension].forEach(metadataDimension => {
          const newMetadata: any = _.clone(metadata);
          newMetadata[splitDimension] = [metadataDimension];
          metadataArray.push(newMetadata);
        });
      }
    });
  }

  return metadataArray;
}
