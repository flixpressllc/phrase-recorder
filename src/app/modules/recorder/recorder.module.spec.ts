import { RecorderModule } from './recorder.module';

describe('RecorderModule', () => {
  let recorderModule: RecorderModule;

  beforeEach(() => {
    recorderModule = new RecorderModule();
  });

  it('should create an instance', () => {
    expect(recorderModule).toBeTruthy();
  });
});
