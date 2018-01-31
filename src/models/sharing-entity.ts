export interface SharingItem {
  id: string;
  name: string;
  access?: string | boolean;
  type?: string;
  isExternal?: boolean;
  isPublic?: boolean;
}
export interface SharingEntity {
  [id: string]: SharingItem;
}

export const INITIAL_SHARING_ENTITY: SharingEntity = {
  external_access: {
    id: 'external_access',
    name: 'External Access',
    access: '--------',
    isExternal: true
  },
  public_access: {
    id: 'public_access',
    name: 'Public Access',
    access: '--------',
    isExternal: false,
    isPublic: true
  }
};
