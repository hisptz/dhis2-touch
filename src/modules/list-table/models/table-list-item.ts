export interface TableListItem {
  value: string | number;
  href?: string;
  style: {
    [styleName: string]: string | number;
  };
  colSpan?: number;
}
