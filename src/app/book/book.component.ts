import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BookApiService } from '../shared/services/bookApi.service';
import { Book } from '../shared/models/book'
import { UtilsService } from '../shared/services/utils.service';
import { Format } from '../shared/models/format';
import { Country } from '../shared/models/country';
import { Company } from '../shared/models/company';
import { City } from '../shared/models/city';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, OnDestroy {

  viewComplitedForm = false;
  viewEmptyForm = false;
  book: Book;
  bookFormat: string;
  countries: Array<Country> = [];
  companies: Array<Company> = [];
  cities: Array<City> = [];
  formats: Array<Format> = [];
  routeSubscription: Subscription;

  newBookForm: FormGroup;
  formErrors = {
    author: '',
    title: '',
    isbn: '',
    pages: '',
    formatId: '',
    description: '',
    price: '',
    countryId: '',
    cityId: '',
    companyId: ''
  }

  constructor(
    private route: ActivatedRoute,
    private bookApiService: BookApiService,
    private utilsService: UtilsService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  loadBook(): void {
    this.routeSubscription = this.route.paramMap
      .subscribe((params: ParamMap) => {
        let bookId = params.get('id')
        if (!bookId) {
          this.loadBooksAttributes();

        } else {
          this.bookApiService.getBookByIb(bookId)
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
        this.viewEmptyForm = true;
      })
  }

  loadFormat(id: String): void {
    this.bookApiService.getBookFormat(id)
      .subscribe((data: Format) => this.bookFormat = data[0].name);
    this.viewComplitedForm = true;
  }

  buildForm() {
    this.newBookForm = this.fb.group({
      author: ['', Validators.required],
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      pages: ['', Validators.required],
      formatId: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      companyId: ['', Validators.required]
    });
  }

  submit() {
    let bookParams = this.newBookForm.value;
    if (!this.newBookForm) return;

    for (let item in this.formErrors) {
      this.formErrors[item] = "";
      let control = this.newBookForm.get(item);

      if (control && !control.dirty && !control.valid) {
        this.formErrors[item] = "The field can not be empty"
      }
    }
    if (this.newBookForm.valid) {
      let completedBok: Book = this.utilsService.setIds(
        bookParams, [
          { name: "countryId", value: this.countries },
          { name: "companyId", value: this.companies, },
          { name: "cityId", value: this.cities },
          { name: "formatId", value: this.formats }
        ])
      this.addBook(completedBok);
      this.router.navigate(['/']);
    }
  }

  addBook(completedBok: Book): void {
    this.bookApiService.addBook(completedBok)
      .subscribe();
  }

  ngOnInit() {
    this.loadBook();
    this.buildForm();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
