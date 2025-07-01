import {Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule }            from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

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
  selector: 'app-nft-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nft-detail.component.html',
  styleUrls: ['./nft-detail.component.css']
})
export class NftDetailComponent {
  private route = inject(ActivatedRoute);
  avatar = JSON.parse(localStorage.getItem('userProfile') || '{}')?.image || '/assets/avatars/default-user.png';
  username = JSON.parse(localStorage.getItem('userProfile') || '{}')?.username || '';

  nft: NftCard | null     = null;
  comments: string[]      = [];
  newComment: string      = '';
  otherNfts: NftCard[]    = [];
  private userItems = signal<NftCard[]>([]);
  private allNfts = signal<NftCard[]>([]);
  filteredNfts = signal<NftCard[]>([]);
  searchTermInput = '';

  constructor(private router: Router) {
    const created = localStorage.getItem('createdItems');
    const ownedIds: string[] = created ? JSON.parse(created).map((i: any) => i.id) : [];

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


    const combined = [...this.userItems()];
    this.allNfts.set(combined);
    this.filteredNfts.set(combined);
  }

  submitComment(): void {
    if (!this.nft || !this.newComment.trim()) return;

    const commentStore = JSON.parse(localStorage.getItem('nftComments') || '{}');
    commentStore[this.nft.id] = commentStore[this.nft.id] || [];
    commentStore[this.nft.id].push(this.newComment.trim());
    localStorage.setItem('nftComments', JSON.stringify(commentStore));

    this.comments.push(this.newComment.trim());
    this.newComment = '';
  }

  goBack(): void {
    history.back();
  }
  private likesStore: Record<string, number> = JSON.parse(localStorage.getItem('likes') ?? '{}');

  likes(id: string) {
    return this.likesStore[id] ?? 0;
  }
  toggleLike(id: string) {
    this.likesStore[id] = (this.likesStore[id] ?? 0) + 1;
    localStorage.setItem('likes', JSON.stringify(this.likesStore));
  }
  goToDetail(id: string) {
    this.router.navigate(['/home/nft-detail', id]);
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

    const newItem = {
      id: nft.id,
      image: nft.image,
      name: nft.title,
      description: nft.subtitle,
      price: nft.price,
      category: nft.category,
      fileDataUrl: nft.image
    };

    myNfts.push(newItem);
    localStorage.setItem('createdItems', JSON.stringify(myNfts));

    const updated = this.allNfts().filter(i => i.id !== nft.id);
    this.allNfts.set(updated);
    this.filteredNfts.set(updated);

    alert('NFT added to your collection!');
  }
  ngOnInit(): void {
    this.filteredNfts.set(this.allNfts());
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      const found = this.allNfts().find(n => n.id === id) || null;
      this.nft = found;
      const store = JSON.parse(localStorage.getItem('nftComments') || '{}');
      this.comments = store[id] || [];
      this.otherNfts = this.allNfts().filter(n => n.username === found?.username && n.id !== id);
    });
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }
}
