import {Injectable} from "@angular/core";
/**
 * Created by mpande on 3/8/18.
 */
@Injectable()
export class Extent {
  constructor() {
  }

  enlarge(theExtent, pt) {
    let modifier = null;
    pt[0] < theExtent.xmin ? theExtent.xmin = pt[0] : modifier = null;
    pt[0] > theExtent.xmax ? theExtent.xmax = pt[0] : modifier = null;
    pt[1] < theExtent.ymin ? theExtent.ymin = pt[1] : modifier = null;
    pt[1] > theExtent.ymax ? theExtent.ymax = pt[1] : modifier = null;
    return theExtent;
  }

  enlargExtent(theExtent, ext) {
    let modifier = null;
    ext.xmax > theExtent.xmax ? theExtent.xmax = ext.xmax : modifier = null;
    ext.xmin < theExtent.xmin ? theExtent.xmin = ext.xmin : modifier = null;
    ext.ymax > theExtent.ymax ? theExtent.ymax = ext.ymax : modifier = null;
    ext.ymin < theExtent.ymin ? theExtent.ymin = ext.ymin : modifier = null;
    return theExtent;
  }

  blank() {
    return {
      xmin: Number.MAX_VALUE,
      ymin: Number.MAX_VALUE,
      xmax: -Number.MAX_VALUE,
      ymax: -Number.MAX_VALUE
    };

  }


}
