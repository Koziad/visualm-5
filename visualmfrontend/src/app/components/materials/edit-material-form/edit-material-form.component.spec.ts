import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialFormComponent } from './edit-material-form.component';

describe('EditMaterialFormComponent', () => {
  let component: EditMaterialFormComponent;
  let fixture: ComponentFixture<EditMaterialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMaterialFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaterialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
