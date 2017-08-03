import { DcasUiPage } from './app.po';

describe('dcas-ui App', () => {
  let page: DcasUiPage;

  beforeEach(() => {
    page = new DcasUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
