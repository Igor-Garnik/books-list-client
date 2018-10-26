import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BookApiService } from '../shared/services/bookApi.service';
import { Format } from '../shared/models/format'
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from '../shared/services/utils.service';
import { Book } from '../shared/models/book';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {

  formats: Array<Format> = [];
  findedBook: Book;
  querySubscription: Subscription;
  searchForm: any;
  validationMessages = {
    'author': {
      'pattern': 'Wrong format'
    }, 'title': {
      'pattern': 'Wrong format'
    }, 'isbn': {
      'pattern': 'The field must contains only numbers, min length 9 numbers'
    }, 'pageMin': {
      'pattern': 'Wrong format'
    }, 'pageMax': {
      'pattern': 'Wrong format'
    }, 'priceMin': {
      'pattern': 'Wrong format'
    }, 'priceMax': {
      'required': 'The field can not be empty'
    }
  };
  formErrors = {
    author: '',
    title: '',
    isbn: '',
    pageMin: '',
    pageMax: '',
    priceMin: '',
    priceMax: ''
  }

  constructor(
    private bookApiService: BookApiService,
    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  loadFormats(): void {
    this.bookApiService.getFormats()
      .subscribe((formats: Array<Format>) => this.formats = formats);
  }

  viewBook() {
    this.querySubscription = this.route.queryParams
      .subscribe((query: any) => {
        if (JSON.stringify(query) == "{}") {
          this.findedBook = null;
          //this.searchForm = this.searchForm = this.fb.group(this.createForm());
          return;
        } else {
          this.bookApiService.getBookByQuery(query)
            .subscribe((book) => {
              this.findedBook = book;
              let completedForm = this.utilsService.completeFormFields(this.createForm(), book);
              this.searchForm = this.fb.group(completedForm);
            });
        }
      })
  }

  createForm() {
    return {
      author: ['', Validators.pattern(/^[a-zA-Z+\s]+$/)],
      title: ['', Validators.pattern(/^[a-zA-Z0-9+\s+.]+$/)],
      isbn: ['', Validators.pattern(/^[0-9]{9,}$/)],
      formatId: [''],
      pageMin: ['', Validators.pattern(/^[0-9]{1,}$/)],
      pageMax: ['', Validators.pattern(/^[0-9]{1,}$/)],
      priceMin: ['', Validators.pattern(/^[0-9]{1,}$/)],
      priceMax: ['', Validators.pattern(/^[0-9]{1,}$/)],

    }
  }

  buildForm() {
    this.searchForm = this.fb.group(this.createForm());
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(data => this.onValueChange());
  }

  onValueChange() {
    console.log('value changed')
    let validationConfig = { name: 'dirty' }
    if (this.searchForm.dirty && this.searchForm.invalid) {
      this.formErrors = Object.assign({}, this.utilsService.setErrorMessage(this.formErrors, this.validationMessages, this.searchForm, validationConfig));
      console.log("this.formErrors ", this.formErrors);
      this.findedBook = null;
    } else {
      let complitedData = this.utilsService.getComplitedData(this.searchForm.value, this.formats);
      console.log("complitedData ", complitedData);
      this.router.navigate(['/search'], { queryParams: complitedData });
      this.formErrors = Object.assign({}, this.utilsService.clearFormFields(this.formErrors));
    }

  }

  ngOnInit() {
    this.loadFormats();
    this.viewBook();
    this.buildForm();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
