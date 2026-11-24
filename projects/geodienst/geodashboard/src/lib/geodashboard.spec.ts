import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Geodashboard } from './geodashboard';

describe('Geodashboard', () => {
  let component: Geodashboard;
  let fixture: ComponentFixture<Geodashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Geodashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Geodashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
