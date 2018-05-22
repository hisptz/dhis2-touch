export const datasets = {
  'USGS/SRTMGL1_003': {
    title: 'Elevation',
    band: 'elevation',
    mask: true,
    legend: {
      unit: 'metres',
      description: 'Elevation above sea-level.',
      source: 'NASA / USGS / JPL-Caltech / Google Earth Engine',
      sourceUrl: 'https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003'
    }
  },
  'WorldPop/POP': {
    title: 'Population density',
    aggregation: 'mosaic',
    mask: true,
    methods: {
      multiply: [100] // Convert from people/hectare to people/km2
    },
    resolution: 100,
    projection: 'EPSG:4326',
    value(value) {
      return Math.round(value);
    },
    legend: {
      unit: 'people per km²',
      description:
        'Population density estimates with national totals adjusted to match UN population division estimates.',
      source: 'WorldPop / Google Earth Engine',
      sourceUrl: 'https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP'
    }
  },
  'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS': {
    title: 'Nighttime lights',
    band: 'stable_lights',
    mask: true,
    popup: '{name}: {value}',
    legend: {
      unit: 'light intensity',
      description:
        'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.',
      source: 'NOAA / Google Earth Engine',
      sourceUrl: 'https://explorer.earthengine.google.com/#detail/NOAA%2FDMSP-OLS%2FNIGHTTIME_LIGHTS'
    }
  },
  'UCSB-CHG/CHIRPS/PENTAD': {
    title: 'Precipitation',
    band: 'precipitation',
    mask: true,
    value(value) {
      return value.toFixed(1);
    },
    legend: {
      unit: 'millimeter',
      description: 'Precipitation collected from satellite and weather stations on the ground.',
      source: 'UCSB / CHG / Google Earth Engine',
      sourceUrl: 'https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD'
    }
  },
  'MODIS/MOD11A2': {
    title: 'Temperature',
    band: 'LST_Day_1km',
    mask: true,
    methods: {
      toFloat: [],
      multiply: [0.02],
      subtract: [273.15]
    },
    value(value) {
      return Math.round(value);
    },
    popup: '{name}: {value}{unit}',
    legend: {
      unit: '°C during daytime',
      description:
        'Land surface temperatures collected from satellite. Blank spots will appear in areas with a persistent cloud cover.',
      source: 'NASA LP DAAC / Google Earth Engine',
      sourceUrl: 'https://explorer.earthengine.google.com/#detail/MODIS%2FMOD11A2'
    }
  },
  'MODIS/051/MCD12Q1': {
    title: 'Landcover',
    band: 'Land_Cover_Type_1',
    params: {
      min: 0,
      max: 17,
      palette:
        'aec3d6,162103,235123,399b38,38eb38,39723b,6a2424,c3a55f,b76124,d99125,92af1f,10104c,cdb400,cc0202,332808,d7cdcc,f7e174,743411'
    },
    mask: false,
    legend: {
      description: 'Distinct landcover types collected from satellites.',
      source: 'NASA LP DAAC / Google Earth Engine',
      sourceUrl: 'https://code.earthengine.google.com/dataset/MODIS/051/MCD12Q1',
      items: [
        {
          color: '#aec3d6',
          name: 'Water'
        },
        {
          color: '#162103',
          name: 'Evergreen Needleleaf forest'
        },
        {
          color: '#235123',
          name: 'Evergreen Broadleaf forest'
        },
        {
          color: '#399b38',
          name: 'Deciduous Needleleaf forest'
        },
        {
          color: '#38eb38',
          name: 'Deciduous Broadleaf forest'
        },
        {
          color: '#39723b',
          name: 'Mixed forest'
        },
        {
          color: '#6a2424',
          name: 'Closed shrublands'
        },
        {
          color: '#c3a55f',
          name: 'Open shrublands'
        },
        {
          color: '#b76124',
          name: 'Woody savannas'
        },
        {
          color: '#d99125',
          name: 'Savannas'
        },
        {
          color: '#92af1f',
          name: 'Grasslands'
        },
        {
          color: '#10104c',
          name: 'Permanent wetlands'
        },
        {
          color: '#cdb400',
          name: 'Croplands'
        },
        {
          color: '#cc0202',
          name: 'Urban and built-up'
        },
        {
          color: '#332808',
          name: 'Cropland/Natural vegetation mosaic'
        },
        {
          color: '#d7cdcc',
          name: 'Snow and ice'
        },
        {
          color: '#f7e174',
          name: 'Barren or sparsely vegetated'
        },
        {
          color: '#743411',
          name: 'Unclassified'
        }
      ]
    },
    popup: '{name}: {value}'
  }
};
