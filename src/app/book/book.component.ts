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

  validationMessages = {
    'author': {
      'required': 'The field can not be empty',
      'pattern': 'Wrong format'
    }, 'title': {
      'required': 'The field can not be empty',
      'pattern': 'Wrong format'
    }, 'isbn': {
      'required': 'The field can not be empty',
      'pattern': 'The field must contains only numbers, min length 9 numbers'
    }, 'pages': {
      'required': 'The field can not be empty',
      'pattern': 'The field must contains only numbers'
    }, 'formatId': {
      'required': 'The field can not be empty'
    }, 'description': {
      'required': 'The field can not be empty'
    }, 'price': {
      'required': 'The field can not be empty',
      'pattern': 'The field must contains only numbers'
    }, 'countryId': {
      'required': 'The field can not be empty'
    }, 'cityId': {
      'required': 'The field can not be empty'
    }, 'companyId': {
      'required': 'The field can not be empty'
    }
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
      author: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z+\s]+$/)
      ]],
      title: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9+\s+.]+$/)
      ]],
      isbn: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9,}$/)
      ]],
      pages: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,4}$/)
      ]],
      formatId: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,}$/)
      ]],
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      companyId: ['', Validators.required]
    });
  }

  submit() {
    if (!this.newBookForm.valid) {
      let validationConfig = { name: 'invalid' }
      this.formErrors = Object.assign({}, this.utilsService.setErrorMessage(this.formErrors, this.validationMessages, this.newBookForm, validationConfig));
    } else {
      let completedBok: Book = this.utilsService.setIds(
        this.newBookForm.value, [
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
