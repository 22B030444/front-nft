// src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  username: string;
  bio: string;
  image: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  bio: string = '';
  previewImage: string | ArrayBuffer | null = null;

  private currentUser = localStorage.getItem('loggedInUser') || '';
  private storageKey = `userProfile_${this.currentUser}`;

  ngOnInit(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const profile: UserProfile = JSON.parse(saved);
      this.username = profile.username;
      this.bio = profile.bio;
      this.previewImage = profile.image;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой (макс. 10 МБ)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    const profile: UserProfile = {
      username: this.username,
      bio: this.bio,
      image: this.previewImage
    };
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
    alert('Профиль сохранён!');
  }
}
