import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftComponent } from './nft.component';

describe('Nft', () => {
  let component: NftComponent;
  let fixture: ComponentFixture<NftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create-nft', () => {
    expect(component).toBeTruthy();
  });
});
