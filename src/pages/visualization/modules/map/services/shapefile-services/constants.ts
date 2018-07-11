/**
 * Created by mpande on 3/8/18.
 */

export const geometries: any = {
  'NULL': 0,
  'POINT': 1,
  'POLYLINE': 3,
  'POLYGON': 5,
  'MULTIPOLYGON': 25,
  'MULTIPOINT': 8,
  'POINTZ': 11,
  'POLYLINEZ': 13,
  'POLYGONZ': 15,
  'MULTIPOINTZ': 18,
  'POINTM': 21,
  'POLYLINEM': 23,
  'POLYGONM': 25,
  'MULTIPOINTM': 28,
  'MULTIPATCH': 31
}

export const prj: any =
  'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]';

export const types = {geometries: geometries, prj: prj};

