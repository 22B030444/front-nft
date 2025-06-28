import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nft-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nft-success.component.html',
  styleUrls: ['./nft-success.component.css']
})
export class NftSuccessComponent {
  nftName = '';
  imageUrl = '';

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.nftName = state['nftName'];
      this.imageUrl = state['imageUrl'];
    }
  }
}
