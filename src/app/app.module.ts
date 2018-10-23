import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BookComponent } from './book/book.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SearchComponent } from './search/search.component';

import { HttpClientModule } from '@angular/common/http';
import { BookApiService } from './shared/services/bookApi.service';
import { UtilsService } from './shared/services/utils.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    NavigationComponent,
    ShowcaseComponent,
    SearchComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BookApiService, UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
