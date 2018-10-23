import { Component, OnInit } from '@angular/core';
import { BookApiService } from '../shared/services/bookApi.service';
import { Book } from '../shared/models/book';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})

export class ShowcaseComponent implements OnInit {

  booksList: Array<Book> = [];

  constructor(
    private bookApiService: BookApiService
  ) { }

  loadBooksList() {
    this.bookApiService.getBooksList()
      .subscribe((list: Array<Book>) => {
        this.booksList = list
      })
  }


  ngOnInit() {
    this.loadBooksList();
  }

}
