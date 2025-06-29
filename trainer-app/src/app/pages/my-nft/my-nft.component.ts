import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NftCard {
  id: string;
  ownerAvatar: string;
  username: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-nft.component.html',
  styleUrls: ['./my-nft.component.css']
})
export class MyNftComponent {

  avatar = JSON.parse(localStorage.getItem('userProfile') || '{}')?.image || '/assets/avatars/default-user.png';
  username = JSON.parse(localStorage.getItem('userProfile') || '{}')?.username || '';
  isLoggedIn = signal(!!this.username);

  private userItems = signal<NftCard[]>([]);
  private ownedItems = signal<NftCard[]>([]);

  constructor() {
    const created = localStorage.getItem('createdItems');
    if (created) {
      const saved: any[] = JSON.parse(created);
      this.userItems.set(
        saved.map(i => ({
          id: i.id,
          ownerAvatar: this.avatar,
          username: this.username,
          image: i.fileDataUrl,
          title: i.name,
          subtitle: i.description,
          category: i.category,
          price: i.price
        }))
      );
    }

    const owned = localStorage.getItem('ownedItems');
    if (owned) {
      this.ownedItems.set(JSON.parse(owned));
    }
  }
  searchTermInput = '';
  filteredNfts = signal<NftCard[]>([]);

  ngOnInit() {
    this.filteredNfts.set([ ...this.userItems()]);
  }

  applySearch() {
    const term = this.searchTermInput.toLowerCase().trim();
    this.filteredNfts.set(
      [ ...this.userItems()].filter(nft =>
        nft.title.toLowerCase().includes(term) ||
        nft.category.toLowerCase().includes(term) ||
        nft.price.toString().includes(term)
      )
    );
  }

  private likesStore: Record<string, number> = JSON.parse(localStorage.getItem('likes') ?? '{}');

  likes(id: string) {
    return this.likesStore[id] ?? 0;
  }

  toggleLike(id: string) {
    this.likesStore[id] = (this.likesStore[id] ?? 0) + 1;
    localStorage.setItem('likes', JSON.stringify(this.likesStore));
  }

  buyNft(nft: NftCard): void {
    const userLogin = localStorage.getItem('loggedInUser');
    if (!userLogin) {
      alert('Please login to buy NFTs');
      return;
    }

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const ownerAvatar = userProfile.image || '/assets/avatars/default-user.png';
    const username = userLogin;

    const myNfts = JSON.parse(localStorage.getItem('createdItems') || '[]');

    const alreadyOwned = myNfts.find((i: any) => i.id === nft.id);
    if (alreadyOwned) {
      alert('You already own this NFT');
      return;
    }

    myNfts.push({
      id: nft.id,
      image: nft.image,
      name: nft.title,
      description: nft.subtitle,
      category: nft.category,
      price: nft.price,
      username,
      fileDataUrl: nft.image
    });

    localStorage.setItem('createdItems', JSON.stringify(myNfts));
    alert('NFT added to your collection!');
  }


}
