import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {NftComponent} from './pages/nft/nft.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {CreateNftComponent} from './pages/create-nft/create-nft.component';
import {MyNftComponent} from './pages/my-nft/my-nft.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home/nfts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'nfts', loadComponent: () => import('./pages/nft/nft.component').then(m => m.NftComponent) },
      { path: 'my-nfts', component: MyNftComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'create-nft', component: CreateNftComponent },
      { path: 'nft-success', loadComponent: () => import('./pages/nft-success/nft-success.component').then(m => m.NftSuccessComponent)},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
