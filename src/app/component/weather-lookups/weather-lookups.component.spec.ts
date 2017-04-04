import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherLookupsComponent } from './weather-lookups.component';

describe('WeatherLookupsComponent', () => {
  let component: WeatherLookupsComponent;
  let fixture: ComponentFixture<WeatherLookupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherLookupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
