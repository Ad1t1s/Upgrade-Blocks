import { Ca2Page } from './app.po';

describe('ca2 App', () => {
  let page: Ca2Page;

  beforeEach(() => {
    page = new Ca2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
