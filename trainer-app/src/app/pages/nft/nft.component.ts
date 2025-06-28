import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NftCard {
  id: string;
  ownerAvatar: string;
  name:string;
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
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css']
})
export class NftComponent {

  avatar = JSON.parse(localStorage.getItem('userProfile') || '{}')?.image
    || '/assets/avatars/default-user.png';

  private demo: NftCard[] = [
    {
      id: 'demo-1',
      ownerAvatar: '/assets/avatars/user-1.png',
      name: 'User123',
      image: '/assets/images/nft1.png',
      title: 'Collection of nightmares',
      subtitle: 'Nightmare (pt.15) 10x10',
      category: 'Games',
      price: 49.99
    },
    {
      id: 'demo-2',
      name: 'User234',
      ownerAvatar: '/assets/avatars/user-2.png',
      image: '/assets/images/nft2.png',
      title: 'Apes',
      subtitle: 'King Bored Ape #2414',
      category: 'Collectibles',
      price: 49.99
    },
    {
      id: 'demo-3',
      name: 'User345',
      ownerAvatar: '/assets/avatars/user-3.png',
      image: '/assets/images/nft3.png',
      title: 'GALLERY_13',
      subtitle: 'HorseNFT #1332',
      category: 'Games',
      price: 49.99
    }
  ];

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
          name:this.userProfile.username,
          image: i.fileDataUrl,
          title: i.name,
          subtitle: i.description,
          category: i.category,
          price: i.price
        }))
      );
    }
  }

  nfts = computed(() => [...this.demo, ...this.userItems()]);

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
