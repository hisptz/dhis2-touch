import {SharingEntity} from './sharing-entity';

export interface DashboardSharing {
  id: string;
  user: {
    id: string;
    name: string;
  };
  sharingEntity: SharingEntity;
}
