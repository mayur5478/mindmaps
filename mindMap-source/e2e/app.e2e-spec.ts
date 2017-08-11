import { MindMapPage } from './app.po';

describe('mind-map App', () => {
  let page: MindMapPage;

  beforeEach(() => {
    page = new MindMapPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
