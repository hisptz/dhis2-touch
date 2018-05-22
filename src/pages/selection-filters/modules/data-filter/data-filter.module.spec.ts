import { DataFilterModule } from './data-filter.module';

describe('DataFilterModule', () => {
  let dataFilterModule: DataFilterModule;

  beforeEach(() => {
    dataFilterModule = new DataFilterModule();
  });

  it('should create an instance', () => {
    expect(dataFilterModule).toBeTruthy();
  });
});
