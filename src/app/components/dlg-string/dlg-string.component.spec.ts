import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgStringComponent } from './dlg-string.component';

describe('DlgStringComponent', () => {
  let component: DlgStringComponent;
  let fixture: ComponentFixture<DlgStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
