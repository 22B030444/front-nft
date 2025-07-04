// src/app/pages/nft/nft.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface NftCard {
  id: string;
  ownerAvatar: string;
  username: string;
  image: string;
  title: string;
  subtitle: string;
  type: string;
  category: string;
  price: number;
  owner: string;
}

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css']
})
export class NftComponent implements OnInit {
  constructor(private router: Router) {}

  private currentUser = localStorage.getItem('loggedInUser') || '';
  private profileKey  = `userProfile_${this.currentUser}`;

  avatar: string = '/assets/avatars/default-user.png';
  username: string = '';
  isLoggedIn: boolean = false;

  private allNfts     = signal<NftCard[]>([]);
  filteredNfts       = signal<NftCard[]>([]);
  searchTermInput    = '';

  private likesStore: Record<string, number> =
    JSON.parse(localStorage.getItem('likes') || '{}');

  ngOnInit() {
    const profRaw = localStorage.getItem(this.profileKey);
    if (profRaw) {
      const prof = JSON.parse(profRaw);
      this.avatar   = prof.image   || this.avatar;
      this.username = prof.username|| this.currentUser;
    }
    this.isLoggedIn = !!this.currentUser;

    this.refreshLists();
  }

  private refreshLists() {
    const raw = localStorage.getItem('createdItems') || '[]';
    const arr: any[] = JSON.parse(raw);

    let migrated = false;
    const fixed = arr.map(item => {
      if (!item.owner) {
        migrated = true;
        return { ...item, owner: this.currentUser };
      }
      return item;
    });

    if (migrated) {
      localStorage.setItem('createdItems', JSON.stringify(fixed));
    }
    const created = fixed;
    const ownItems: NftCard[] = created
      .filter(i => i.owner === this.currentUser)
      .map(i => this.toCard(i, this.avatar, this.username));

    const otherItems: NftCard[] = created
      .filter(i => i.owner && i.owner !== this.currentUser)
      .map(i => {
        const prof = JSON.parse(localStorage.getItem(`userProfile_${i.owner}`) || '{}');
        return this.toCard(i,
          prof.image    || '/assets/avatars/default-user.png',
          prof.username || i.owner
        );
      });

    const demo: Omit<NftCard, 'ownerAvatar'|'username'|'owner'>[] = [
      { id: 'demo-1', image: 'assets/images/nft1.png', title: 'Collection of nightmares', subtitle: 'Nightmare (pt.15) 10×10', type:'', category: 'Games',        price: 49.99 },
      { id: 'demo-2', image: 'assets/images/nft2.png', title: 'Apes',                  subtitle: 'King Bored Ape #2414',      type:'', category: 'Collectibles', price: 35    },
      { id: 'demo-3', image: 'assets/images/nft3.png', title: 'GALLERY_13',            subtitle: 'HorseNFT #1332',           type:'', category: 'Music',        price: 75    },
      { id: 'demo-5', image: 'assets/images/nft4.png', title: 'USSR',                  subtitle: 'USSR 2.Edition 07',        type:'', category: 'Collectibles', price: 49.99 }
    ];

    const demoItems: NftCard[] = demo
      .filter(d => !created.some(c => c.id === d.id))
      .map(d => ({
        ...d,
        ownerAvatar:  '/assets/avatars/default-user.png',
        username:     'market',
        owner:        'market'
      }));

    const combined = [...otherItems, ...demoItems, ...ownItems];
    this.allNfts.set(combined);
    this.filteredNfts.set(combined);
  }

  private toCard(i: any, avatar: string, username: string): NftCard {
    return {
      id:           i.id,
      ownerAvatar:  avatar,
      username:     username,
      image:        i.fileDataUrl,
      title:        i.name,
      subtitle:     i.subtitle ?? i.description,
      type:         i.type,
      category:     i.category,
      price:        i.price,
      owner:        i.owner
    };
  }

  applySearch() {
    const term = this.searchTermInput.toLowerCase().trim();
    this.filteredNfts.set(
      this.allNfts().filter(nft =>
        nft.title.toLowerCase().includes(term) ||
        nft.category.toLowerCase().includes(term) ||
        nft.price.toString().includes(term)
      )
    );
  }

  likes(id: string): number {
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
    const all = JSON.parse(raw) as any[];

    if (all.some(i => i.id === nft.id && i.owner === this.currentUser)) {
      alert('Вы уже владеете этим NFT');
      return;
    }

    const withoutOld = all.filter(i => i.id !== nft.id);

    withoutOld.push({
      id:          nft.id,
      name:        nft.title,
      subtitle:    nft.subtitle,
      category:    nft.category,
      type:        nft.type,
      price:       nft.price,
      fileDataUrl: nft.image,
      owner:       this.currentUser
    });

    localStorage.setItem('createdItems', JSON.stringify(withoutOld));
    alert('NFT успешно передан в вашу коллекцию!');
    this.refreshLists();
  }
  goToDetail(id: string) {
    this.router.navigate(['/home/nft-detail', id]);
  }
}
