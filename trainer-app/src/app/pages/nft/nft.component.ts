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
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css']
})
export class NftComponent {

  avatar = JSON.parse(localStorage.getItem('userProfile') || '{}')?.image || '/assets/avatars/default-user.png';
  username = JSON.parse(localStorage.getItem('userProfile') || '{}')?.username || '';
  // isLoggedIn = signal(!!this.username);

  private demo: NftCard[] = [
    {
      id: 'demo-1',
      ownerAvatar: '/assets/avatars/user-1.png',
      username: 'alice',
      image: '/assets/images/nft1.png',
      title: 'Collection of nightmares',
      subtitle: 'Nightmare (pt.15) 10x10',
      category: 'Games',
      price: 49.99
    },
    {
      id: 'demo-2',
      ownerAvatar: '/assets/avatars/user-2.png',
      username: 'bob',
      image: '/assets/images/nft2.png',
      title: 'Apes',
      subtitle: 'King Bored Ape #2414',
      category: 'Collectibles',
      price: 35
    },
    {
      id: 'demo-3',
      ownerAvatar: '/assets/avatars/user-2.png',
      username: 'bob',
      image: '/assets/images/nft3.png',
      title: 'GALLERY_13',
      subtitle: 'HorseNFT #1332',
      category: 'Music',
      price: 75
    },
    {
      id: 'demo-3',
      ownerAvatar: '/assets/avatars/user-2.png',
      username: 'bob',
      image: '/assets/images/nft3.png',
      title: 'GALLERY_13',
      subtitle: 'HorseNFT #1332',
      category: 'Music',
      price: 75
    }
  ];

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
    this.filteredNfts.set([...this.demo, ...this.userItems()]);
  }

  applySearch() {
    const term = this.searchTermInput.toLowerCase().trim();
    this.filteredNfts.set(
      [...this.demo, ...this.userItems()].filter(nft =>
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

    // Данные текущего пользователя
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const ownerAvatar = userProfile.image || '/assets/avatars/default-user.png';
    const username = userLogin;

    const myNfts = JSON.parse(localStorage.getItem('createdItems') || '[]');

    // Проверка: уже куплен?
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
      fileDataUrl: nft.image // для совместимости
    });

    localStorage.setItem('createdItems', JSON.stringify(myNfts));
    alert('NFT added to your collection!');
  }
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }

}
