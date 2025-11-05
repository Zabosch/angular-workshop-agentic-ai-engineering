import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-3xl">
      <a routerLink="/" class="text-sm text-blue-600 hover:underline">← Back to list</a>

      <h1 class="text-2xl font-bold mt-6">Edit Book</h1>

      <div *ngIf="loading" class="py-12 flex justify-center">
        <div class="text-gray-600">Loading book...</div>
      </div>

      <!-- Large cover preview at the top -->
      <div *ngIf="!loading" class="mt-6 flex flex-col items-center">
        <div class="w-44 h-64 sm:w-56 sm:h-80 bg-gray-50 overflow-hidden flex items-center justify-center">
          <img *ngIf="form.get('cover')?.value; else noCoverLarge" [src]="form.get('cover')?.value" [alt]="form.get('title')?.value || 'Cover'" class="w-full h-full object-contain" />
          <ng-template #noCoverLarge>
            <div class="text-center px-2">
              <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
              </svg>
              <p class="text-gray-400 text-sm mt-2">No cover</p>
            </div>
          </ng-template>
        </div>

  <h2 class="mt-4 text-xl font-semibold text-gray-800">{{ form.get('title')?.value || 'Untitled' }}</h2>
  <p class="text-sm text-gray-600">{{ form.get('author')?.value }}</p>
      </div>

      <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="save()" class="mt-6 bg-gray-200 p-6 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-gray-700">Title</span>
            <input formControlName="title" class="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Subtitle</span>
            <input formControlName="subtitle" class="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Author</span>
            <input formControlName="author" class="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Publisher</span>
            <input formControlName="publisher" class="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-gray-700">ISBN</span>
              <input formControlName="isbn" class="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-gray-700">Pages</span>
              <input type="number" formControlName="numPages" class="mt-1 block w-full border rounded px-3 py-2" />
            </label>
          </div>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Price</span>
            <input formControlName="price" class="mt-1 block w-full border rounded px-3 py-2" />
          </label>

              <label class="block">
                <span class="text-sm font-medium text-gray-700">Cover URL</span>
                <input formControlName="cover" class="mt-1 block w-full border rounded px-3 py-2" placeholder="https://example.com/cover.jpg" />
                <p class="text-xs text-gray-400 mt-1">Paste an image URL to update the cover preview above.</p>
              </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Summary</span>
            <textarea formControlName="abstract" class="mt-1 block w-full border rounded px-3 py-2" rows="5"></textarea>
          </label>

          <div class="flex items-center gap-3 mt-2">
            <button type="submit" [disabled]="form.invalid || saving" class="bg-blue-600 text-white px-4 py-2 rounded">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
            <a [routerLink]="['/books', bookId]" class="text-sm text-gray-600 hover:underline">Cancel</a>
          </div>

          <div *ngIf="error" class="text-red-600 mt-2">{{ error }}</div>
        </div>
      </form>
    </div>
  `
})
export class BookEditComponent implements OnInit {
  // Initialize form in the constructor to avoid using `this.fb` before it's assigned
  form!: import('@angular/forms').FormGroup;

  loading = true;
  saving = false;
  error?: string;
  bookId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: BookApiClient
  ) {}

  ngOnInit(): void {
    // create form now that fb is available
    this.form = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      author: ['', Validators.required],
      publisher: [''],
      isbn: [''],
      numPages: [0],
      price: [''],
      cover: [''],
      abstract: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Missing book id.';
      this.loading = false;
      return;
    }
    this.bookId = id;

    this.api.getBook(id).subscribe({
      next: (b: Book) => {
        this.form.patchValue({
          title: b.title,
          subtitle: b.subtitle || '',
          author: b.author,
          publisher: b.publisher || '',
          isbn: b.isbn || '',
          numPages: b.numPages || 0,
          price: b.price || '',
          cover: b.cover || '',
          abstract: b.abstract || ''
        });
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load book for edit', err);
        this.error = 'Failed to load book for editing.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (!this.bookId) return;
    if (this.form.invalid) return;

    this.saving = true;
    const payload = this.form.value as Partial<Book>;

    this.api.updateBook(this.bookId, payload).subscribe({
      next: updated => {
        this.saving = false;
        // Navigate back to the details page
        this.router.navigate(['/books', this.bookId]);
      },
      error: err => {
        console.error('Save failed', err);
        this.error = 'Failed to save changes.';
        this.saving = false;
      }
    });
  }
}
