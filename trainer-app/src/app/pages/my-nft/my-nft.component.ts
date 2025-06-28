import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NftCard {
  id: string;
  ownerAvatar: string;
  username:string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-nft.component.html',
  styleUrls: ['./my-nft.component.css']
})
export class MyNftComponent {

  avatar = JSON.parse(localStorage.getItem('userProfile') || '{}')?.image
    || '/assets/avatars/default-user.png';

  private userItems = signal<NftCard[]>([]);
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

  constructor() {
    const raw = localStorage.getItem('createdItems');
    if (raw) {
      const saved: any[] = JSON.parse(raw);
      this.userItems.set(
        saved.map(i => ({
          id: i.id,
          ownerAvatar: this.avatar,
          username:this.userProfile.username,
          image: i.fileDataUrl,
          title: i.name,
          subtitle: i.description,
          category: i.category,
          price: i.price
        }))
      );
    }
  }

  nfts = computed(() => [...this.userItems()]);

  private likesStore: Record<string, number> =
    JSON.parse(localStorage.getItem('likes') ?? '{}');

  likes(id: string) {
    return this.likesStore[id] ?? 0;
  }

  toggleLike(id: string) {
    this.likesStore[id] = (this.likesStore[id] ?? 0) + 1;
    localStorage.setItem('likes', JSON.stringify(this.likesStore));
  }
}
