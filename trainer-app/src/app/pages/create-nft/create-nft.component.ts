// src/app/create-nft/create-nft.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface NftItem {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  description: string;
  fileDataUrl: string;
  fileName: string;
  owner: string;
}

@Component({
  selector: 'app-create-nft',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css']
})
export class CreateNftComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    name: '',
    category: '',
    type: '',
    price: 0,
    description: '',
    file: this.fb.nonNullable.control<File | null>(null)
  });

  previewUrl = signal<string | null>(null);
  items     = signal<NftItem[]>([]);
  private currentUser = localStorage.getItem('loggedInUser') || '';

  constructor() {

    const raw = localStorage.getItem('createdItems');
    if (raw) this.items.set(JSON.parse(raw));

    effect(() => {
      localStorage.setItem('createdItems', JSON.stringify(this.items()));
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.form.controls.file.setValue(file);
    if (!file) {
      this.previewUrl.set(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  changePrice(delta: number): void {
    const price = this.form.controls.price.value ?? 0;
    const newPrice = Math.max(0, price + delta);
    this.form.controls.price.setValue(+newPrice.toFixed(2));
  }

  create(): void {
    if (this.form.invalid) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    const fv = this.form.getRawValue();
    const id = crypto.randomUUID();

    const saveItem = (fileUrl: string) => {
      const newItem: NftItem = {
        id,
        name:         fv.name,
        category:     fv.category,
        type:         fv.type,
        price:        fv.price,
        description:  fv.description,
        fileDataUrl:  fileUrl,
        fileName:     fv.file?.name ?? '',
        owner:        this.currentUser
      };

      this.items.set([...this.items(), newItem]);

      this.form.reset({ price: 0 });
      this.previewUrl.set(null);

      this.router.navigate(['/home/nft-success'], {
        state: { nftName: newItem.name, imageUrl: fileUrl }
      });
    };

    if (fv.file) {
      const reader = new FileReader();
      reader.onload = () => saveItem(reader.result as string);
      reader.readAsDataURL(fv.file);
    } else {
      saveItem('');
    }
  }
}
