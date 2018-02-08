import { InterpretationModule } from './interpretation.module';

describe('InterpretationModule', () => {
  let interpretationModule: InterpretationModule;

  beforeEach(() => {
    interpretationModule = new InterpretationModule();
  });

  it('should create an instance', () => {
    expect(interpretationModule).toBeTruthy();
  });
});
