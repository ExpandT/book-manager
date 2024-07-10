import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {Book} from "../../interfaces/book";
import {BookForm} from "../../interfaces/book-form";

type TypedFormGroup<T> = FormGroup<{ [P in keyof T]: FormControl<T[P]> }>;

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss'
})
export class BookFormComponent {
  bookForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book,
  ) {
    this.bookForm = this.fb.group({
      id: new FormControl<number | null>(data?.id || null),
      title: new FormControl<string>(data?.title || '', Validators.required),
      author: new FormControl<string>(data?.author || '', Validators.required),
      year: new FormControl<string | number>(data?.year || '', Validators.required),
      description: new FormControl<string>(data?.description || ''),
      coverImage: new FormControl<string>(data?.coverImage || '')
    }) as TypedFormGroup<BookForm>;
  }

  onSave() {
    if (this.bookForm.valid) {
      this.dialogRef.close(this.bookForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
