export interface Dictionary {
  id: string;
  name: string;
  description: string;
  progress: {
    loading: boolean;
    loadingSucceeded: boolean;
    loadingFailed: boolean;
  };
}
