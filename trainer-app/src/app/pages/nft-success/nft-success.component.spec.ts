import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftSuccessComponent } from './nft-success.component';

describe('NftSuccess', () => {
  let component: NftSuccessComponent;
  let fixture: ComponentFixture<NftSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
