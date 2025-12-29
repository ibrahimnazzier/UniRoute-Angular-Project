import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBoard } from './live-board';

describe('LiveBoard', () => {
  let component: LiveBoard;
  let fixture: ComponentFixture<LiveBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
