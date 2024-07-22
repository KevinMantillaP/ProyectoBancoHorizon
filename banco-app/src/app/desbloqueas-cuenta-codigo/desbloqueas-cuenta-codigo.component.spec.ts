import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloqueasCuentaCodigoComponent } from './desbloqueas-cuenta-codigo.component';

describe('DesbloqueasCuentaCodigoComponent', () => {
  let component: DesbloqueasCuentaCodigoComponent;
  let fixture: ComponentFixture<DesbloqueasCuentaCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesbloqueasCuentaCodigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesbloqueasCuentaCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
