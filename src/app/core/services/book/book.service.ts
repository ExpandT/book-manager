import { Injectable } from '@angular/core';
import {Book} from "../../interfaces/book";
import {BehaviorSubject, Observable} from "rxjs";
import {LocalStorageService} from "../local-storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly localStorageKey = 'books';
  private books: BehaviorSubject<Book[]>;

  constructor(private localStorageService: LocalStorageService) {
    if (!this.localStorageService.hasItem(this.localStorageKey)) {
      const defaultBooks: Book[] = [
        { id: 1, title: 'Harry The Potter', author: 'J.K. Rowling', year: 1997, description: 'Description 1', coverImage: 'assets/images/harry-potter-book-cover.jpg' },
        { id: 2, title: 'Looking For Alaska', author: 'John Green', year: 2005, description: 'Description 2', coverImage: 'assets/images/looking-for-alaska-book-cover.jpg' },
      ];
      this.localStorageService.setItem(this.localStorageKey, defaultBooks);
    }

    const savedBooks = this.localStorageService.getItem<Book[]>(this.localStorageKey) || [];
    this.books = new BehaviorSubject<Book[]>(savedBooks);
  }

  getBooks(): Observable<Book[]> {
    return this.books.asObservable();
  }

  private saveToLocalStorage(books: Book[]) {
    this.localStorageService.setItem(this.localStorageKey, books);
  }

  addBook(book: Book) {
    const currentBooks = this.books.value;
    const newBook = { ...book, id: currentBooks.length + 1 };
    const updatedBooks = [...currentBooks, newBook];
    this.books.next(updatedBooks);
    this.saveToLocalStorage(updatedBooks);
  }

  updateBook(updatedBook: Book) {
    const updatedBooks = this.books.value.map(book =>
      book.id === updatedBook.id ? updatedBook : book
    );
    this.books.next(updatedBooks);
    this.saveToLocalStorage(updatedBooks);
  }

  deleteBook(id: number) {
    const updatedBooks = this.books.value.filter(book => book.id !== id);
    this.books.next(updatedBooks);
    this.saveToLocalStorage(updatedBooks);
  }
}
