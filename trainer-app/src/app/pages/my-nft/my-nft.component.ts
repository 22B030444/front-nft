// src/app/my-nft/my-nft.component.ts
import { Component, OnInit, signal } from '@angular/core';
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
  owner: string;
}

@Component({
  selector: 'app-my-nft',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-nft.component.html',
  styleUrls: ['./my-nft.component.css']
})
export class MyNftComponent implements OnInit {

  private currentUser = localStorage.getItem('loggedInUser') || '';
  private profileKey  = `userProfile_${this.currentUser}`;
  avatar = (JSON.parse(localStorage.getItem(this.profileKey) || '{}') as any).image
    || '/assets/avatars/default-user.png';
  username = (JSON.parse(localStorage.getItem(this.profileKey) || '{}') as any).username
    || this.currentUser;
  isLoggedIn = !!this.currentUser;

  private userItems   = signal<NftCard[]>([]);
  filteredNfts        = signal<NftCard[]>([]);
  searchTermInput     = '';

  private likesStore: Record<string, number> =
    JSON.parse(localStorage.getItem('likes') || '{}');

  ngOnInit() {
    const raw = localStorage.getItem('createdItems') || '[]';
    const all: any[] = JSON.parse(raw);

    const mine: NftCard[] = all
      .filter(i => i.owner === this.currentUser)
      .map(i => ({
        id:           i.id,
        ownerAvatar:  this.avatar,
        username:     this.username,
        image:        i.fileDataUrl,
        title:        i.name,
        subtitle:     i.subtitle || i.description,
        category:     i.category,
        price:        i.price,
        owner:        i.owner
      }));

    this.userItems.set(mine);
    this.filteredNfts.set(mine);
  }

  applySearch() {
    const term = this.searchTermInput.toLowerCase().trim();
    this.filteredNfts.set(
      this.userItems().filter(nft =>
        nft.title.toLowerCase().includes(term) ||
        nft.category.toLowerCase().includes(term) ||
        nft.price.toString().includes(term)
      )
    );
  }

  likes(id: string) {
    return this.likesStore[id] ?? 0;
  }

  toggleLike(id: string) {
    this.likesStore[id] = (this.likesStore[id] ?? 0) + 1;
    localStorage.setItem('likes', JSON.stringify(this.likesStore));
  }

  buyNft(nft: NftCard): void {
    if (!this.isLoggedIn) {
      alert('Пожалуйста, войдите, чтобы купить NFT');
      return;
    }

    const raw = localStorage.getItem('createdItems') || '[]';
    const all: any[] = JSON.parse(raw);

    if (all.some(i => i.id === nft.id && i.owner === this.currentUser)) {
      alert('Вы уже владеете этим NFT');
      return;
    }

    all.push({
      id:          nft.id,
      name:        nft.title,
      subtitle:    nft.subtitle,
      category:    nft.category,
      price:       nft.price,
      fileDataUrl: nft.image,
      owner:       this.currentUser
    });

    localStorage.setItem('createdItems', JSON.stringify(all));

    const updated = all
      .filter(i => i.owner === this.currentUser)
      .map(i => ({
        id:           i.id,
        ownerAvatar:  this.avatar,
        username:     this.username,
        image:        i.fileDataUrl,
        title:        i.name,
        subtitle:     i.subtitle || i.description,
        category:     i.category,
        price:        i.price,
        owner:        i.owner
      }));

    this.userItems.set(updated);
    this.filteredNfts.set(updated);

    alert('NFT добавлен в вашу коллекцию!');
  }
}
