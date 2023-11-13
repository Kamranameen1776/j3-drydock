import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JibeComponentsModule } from 'jibe-components';
import { MenuModule, PaginatorModule, SharedModule as PrimeNgModule } from 'primeng';

const components = [];

const pipes = [];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [CommonModule, FormsModule, JibeComponentsModule, MenuModule, PaginatorModule, PrimeNgModule, ReactiveFormsModule, RouterModule],
  exports: [JibeComponentsModule, ...components, ...pipes],
  providers: [DatePipe]
})
export class SharedModule {}
