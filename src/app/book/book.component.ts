import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { BookApiService } from '../shared/services/bookApi.service';
import { Book } from '../shared/models/book'
import { UtilsService } from '../shared/services/utils.service';
import { Format } from '../shared/models/format';
import { Country } from '../shared/models/country';
import { Company } from '../shared/models/company';
import { City } from '../shared/models/city';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html'
})
export class BookComponent implements OnInit {

  book: Book;
  bookFormat: string;
  //config: Book = new Book();
  countries: Array<Country> = [];
  companies: Array<Company> = [];
  cities: Array<City> = [];
  formats: Array<Format> = [];
  attributeName: Array<String> = ['companyId', 'countryId', 'cityId', 'formatId'];
  attrConfig: Book = new Book();


  constructor(
    private route: ActivatedRoute,
    private bookApiService: BookApiService,
    private utilsService: UtilsService
  ) { }

  loadBook(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        let bookId = params.get('id')
        if (!bookId) {
          this.loadBooksAttributes();
        } else {
          this.bookApiService.getOneBook(bookId)
            .subscribe((book: Array<Book>) => {
              this.book = book[0];
              this.loadFormat(this.book.formatId);
            });
        }
      })
  }

  loadBooksAttributes(): void {
    this.bookApiService.getAttributes()
      .subscribe((data: any) => {
        [this.companies, this.countries, this.cities, this.formats] = data;
      })
  }

  loadFormat(id: String): void {
    this.bookApiService.getBookFormat(id)
      .subscribe((data: Format) => this.bookFormat = data[0].name);
  }

  addBook() {
    this.bookApiService.addBook(JSON.stringify(this.attrConfig))
      .subscribe()
  }

  setAttribute(attrName: String, attributes: any, field): void {
    this.attrConfig[field] = this.findId(attrName, attributes)
  }

  findId(name, attributes): String {
    return this.utilsService.findId(name, attributes)
  }


  ngOnInit() {
    this.loadBook();
  }

}
