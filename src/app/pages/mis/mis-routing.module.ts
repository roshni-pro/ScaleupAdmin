import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisGenerationComponent } from './components/mis-generation/mis-generation.component';

const routes: Routes = [
  {path:'mis-generation',component:MisGenerationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisRoutingModule { }
