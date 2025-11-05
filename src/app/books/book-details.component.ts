import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <a routerLink="/" class="text-sm text-blue-600 hover:underline">← Back to list</a>

      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"></div>
          <p class="mt-4 text-gray-600">Loading book...</p>
        </div>
      </div>

      <div *ngIf="!loading && book" class="bg-white rounded-lg shadow p-6 mt-6">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-full md:w-1/3 flex items-start justify-center">
            <img *ngIf="book.cover" [src]="book.cover" [alt]="book.title" class="max-h-64 object-contain" />
            <div *ngIf="!book.cover" class="w-full h-48 bg-gray-100 flex items-center justify-center">
              <span class="text-gray-500">No cover available</span>
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-800">{{ book.title }}</h1>
            <p *ngIf="book.subtitle" class="text-gray-600 mt-1">{{ book.subtitle }}</p>
            <p class="text-sm text-gray-700 mt-3">By <strong>{{ book.author }}</strong></p>

            <div class="mt-4 text-sm text-gray-600 space-y-1">
              <p *ngIf="book.publisher">Publisher: {{ book.publisher }}</p>
              <p *ngIf="book.isbn">ISBN: {{ book.isbn }}</p>
              <p *ngIf="book.numPages">Pages: {{ book.numPages }}</p>
              <p *ngIf="book.price">Price: {{ book.price }}</p>
            </div>

            <div *ngIf="book.abstract" class="mt-6 text-gray-700">
              <h3 class="font-semibold mb-2">Summary</h3>
              <p>{{ book.abstract }}</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && error" class="mt-8 text-center text-red-600">{{ error }}</div>
      <div *ngIf="!loading && !book && !error" class="mt-8 text-center text-gray-600">Book not found.</div>
    </div>
  `
})
export class BookDetailsComponent implements OnInit {
  book?: Book;
  loading = true;
  error?: string;

  constructor(private route: ActivatedRoute, private api: BookApiClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Missing book id in the route.';
      this.loading = false;
      return;
    }

    this.api.getBook(id).subscribe({
      next: b => {
        this.book = b;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching book:', err);
        this.error = 'Failed to load book.';
        this.loading = false;
      }
    });
  }
}
