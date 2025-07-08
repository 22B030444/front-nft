
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

export interface NftCard {
  id: string;
  email: string;
  ownerAvatar: string;
  username: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-nft-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nft-detail.component.html',
  styleUrls: ['./nft-detail.component.css']
})
export class NftDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private allNfts      = signal<NftCard[]>([]);
  private loggedInUser = localStorage.getItem('loggedInUser') || '';
  currentUserAvatar: string = '/assets/avatars/default-user.png';
  otherNfts: NftCard[] = [];
  nft: NftCard | null = null;
  comments: string[] = [];
  newComment = '';

  private likesStore: Record<string, number> =
    JSON.parse(localStorage.getItem('likes') || '{}');

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }

  ngOnInit(): void {

    if (this.loggedInUser) {
      const myProf = JSON.parse(
        localStorage.getItem(`userProfile_${this.loggedInUser}`) || '{}'
      );
      this.currentUserAvatar = myProf.image || this.currentUserAvatar;
    }

    const raw = localStorage.getItem('createdItems') || '[]';
    const list: any[] = JSON.parse(raw);
    const cards: NftCard[] = list.map(i => {
      const prof = JSON.parse(
        localStorage.getItem(`userProfile_${i.email}`) || '{}'
      );
      return {
        id:           i.id,
        email:        i.email,
        ownerAvatar:  prof.image || '/assets/avatars/default-user.png',
        username:     prof.username || i.email,
        image:        i.fileDataUrl,
        title:        i.name,
        subtitle:     i.subtitle || i.description,
        category:     i.category,
        price:        i.price
      };
    });
    this.allNfts.set(cards);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/home/nfts']);
        return;
      }
      this.nft = this.allNfts().find(n => n.id === id) || null;
      if (!this.nft) {
        alert('NFT не найден');
        this.router.navigate(['/home/nfts']);
        return;
      }

      const store = JSON.parse(localStorage.getItem('nftComments') || '{}');
      this.comments = store[id] || [];

      this.otherNfts = this.allNfts()
        .filter(n => n.email === this.nft!.email && n.id !== id);
    });
  }

  submitComment(): void {
    if (!this.nft || !this.newComment.trim()) return;

    const store = JSON.parse(localStorage.getItem('nftComments') || '{}');
    store[this.nft.id] = store[this.nft.id] || [];
    store[this.nft.id].push(this.newComment.trim());
    localStorage.setItem('nftComments', JSON.stringify(store));

    this.comments.push(this.newComment.trim());
    this.newComment = '';
  }

  likes(id: string): number {
    return this.likesStore[id] ?? 0;
  }

  toggleLike(id: string): void {
    this.likesStore[id] = (this.likesStore[id] ?? 0) + 1;
    localStorage.setItem('likes', JSON.stringify(this.likesStore));
  }
  buyNft(nft: NftCard): void {
    if (!this.isLoggedIn) {
      alert('Пожалуйста, войдите, чтобы купить NFT');
      return;
    }

    const user = localStorage.getItem('loggedInUser')!;
    const raw = localStorage.getItem('createdItems') || '[]';
    const all = JSON.parse(raw) as any[];

    if (all.some(i => i.id === nft.id && i.email === user)) {
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
      email:       user
    });
    localStorage.setItem('createdItems', JSON.stringify(all));

    alert('NFT добавлен в вашу коллекцию!');
  }
  goToDetail(id: string): void {
    this.router.navigate(['/home/nft-detail', id]);
  }

  goBack(): void {
    history.back();
  }
}
