import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule
  ],
})
export class AppModule { }
