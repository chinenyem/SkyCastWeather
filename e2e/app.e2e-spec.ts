import { SkyCastWeatherPage } from './app.po';

describe('sky-cast-weather App', () => {
  let page: SkyCastWeatherPage;

  beforeEach(() => {
    page = new SkyCastWeatherPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
