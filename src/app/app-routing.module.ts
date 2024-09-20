import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/auth/auth.guard';
import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { UnauthorizedComponent } from './layouts/unauthorized/unauthorized.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'pages', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES,
  },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'unauthorized', component:UnauthorizedComponent }




  // { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
