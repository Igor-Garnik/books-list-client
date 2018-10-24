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
  booksList: Book;
  querySubscription: Subscription;
  searchForm: FormGroup;
  fields = {
    author: '',
    title: '',
    isbn: '',
    formatId: '',
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
          return;
        } else {
          this.bookApiService.getBookByQuery(query)
            .subscribe((book) => {
              this.booksList = Object.assign({}, book);
              this.fields = Object.assign({}, book);
              this.searchForm = this.fb.group(this.fields);
            });
        }
      })
  }

  buildForm() {
    this.searchForm = this.fb.group(this.fields);
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(data => this.onValueChange());
  }

  onValueChange() {
    let complitedData = this.utilsService.getComplitedData(this.searchForm.value, this.formats);
    this.router.navigate(['/search'], { queryParams: complitedData })
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
