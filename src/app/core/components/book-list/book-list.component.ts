import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {MatIcon} from "@angular/material/icon";
import {Book} from "../../interfaces/book";
import {MatDialog} from "@angular/material/dialog";
import {BookService} from "../../services/book/book.service";
import {map, Observable, startWith, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {BookFormComponent} from "../book-form/book-form.component";
import {BookDetailsComponent} from "../book-details/book-details.component";
import {listAnimation} from "../../../animations/list-animation";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatButton,
    MatList,
    MatLabel,
    MatListItem,
    MatLine,
    MatIconButton,
    MatIcon,
    AsyncPipe,
    MatFormField,
    ReactiveFormsModule,
    MatInput
  ],
  animations: [listAnimation],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit{
  books$: Observable<Book[]>;
  searchForm: FormGroup<{
    searchTerm: FormControl<string | null>
  }>;

  constructor(private fb: FormBuilder, private bookService: BookService, private dialog: MatDialog) {
    this.books$ = this.bookService.getBooks();
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit() {
    this.books$ = this.searchForm.get('searchTerm')!.valueChanges.pipe(
      startWith(''),
      map(term => term?.toLowerCase()),
      switchMap((term => this.bookService.getBooks().pipe(
        map(books => books.filter(book =>
          book.title.toLowerCase().includes(term!!) || book.author.toLowerCase().includes(term!!)
        ))
      )),
    ))
  }

  addBook() {
    const dialogRef = this.dialog.open(BookFormComponent, { width: '400px'});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.addBook(result);
      }
    });
  }

  editBook(book: Book) {
    const dialogRef = this.dialog.open(BookFormComponent, { width: '400px', data: book });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.updateBook(result);
      }
    });
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id);
  }

  viewBookDetails(book: Book) {
    this.dialog.open(BookDetailsComponent, { width: '400px', data: book });
  }
}
