import { AddressPipe } from './address-pipe';

describe('FullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new AddressPipe()
    expect(pipe).toBeTruthy();
  });
});
