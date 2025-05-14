import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes'; // ou app-routing.module.ts
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module'; // caminho relativo correto

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // se estiver usando rotas
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
