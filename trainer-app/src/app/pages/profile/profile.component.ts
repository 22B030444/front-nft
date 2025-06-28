import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule]
})
export class ProfileComponent implements OnInit {
  username: string = '';
  bio: string = '';
  previewImage: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      const profile = JSON.parse(saved);
      this.username = profile.username;
      this.bio = profile.bio;
      this.previewImage = profile.image;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('File is too large or invalid!');
    }
  }

  saveProfile(): void {
    const profile = {
      username: this.username,
      bio: this.bio,
      image: this.previewImage
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile saved!');
  }
}
