import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNftComponent } from './my-nft.component';

describe('MyNft', () => {
  let component: MyNftComponent;
  let fixture: ComponentFixture<MyNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
