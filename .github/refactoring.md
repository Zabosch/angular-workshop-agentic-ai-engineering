# Angular 20 Refactoring Guide

This guide outlines the necessary changes to modernize your Angular application to follow the latest best practices and patterns in Angular 20+.

## Table of Contents
1. [Component Changes](#component-changes)
2. [State Management](#state-management)
3. [Template Updates](#template-updates)
4. [Dependency Injection](#dependency-injection)
5. [Observable Handling](#observable-handling)

## Component Changes

### Remove Standalone Flag
The `standalone: true` flag is now the default in Angular 20+ and should be removed.

Before:
```typescript
@Component({
  selector: 'app-book-list',
  standalone: true,  // Remove this
  imports: [CommonModule, FormsModule]
})
```

After:
```typescript
@Component({
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule]
})
```

### Replace Input/Output Decorators with Signal APIs

Before:
```typescript
@Input() pageSize: number = 10;
@Output() bookSelected = new EventEmitter<Book>();
```

After:
```typescript
pageSize = input<number>(10);
bookSelected = output<Book>();
```

## State Management

### Use Signals for Component State

Before:
```typescript
export class BookListComponent {
  books: Book[] = [];
  loading: boolean = true;
  searchTerm: string = '';
}
```

After:
```typescript
export class BookListComponent {
  books = signal<Book[]>([]);
  loading = signal(true);
  searchTerm = signal('');
}
```

## Template Updates

### Replace *ngIf with @if

Before:
```html
<div *ngIf="loading">Loading...</div>
<div *ngIf="!loading">
  Content here...
</div>
```

After:
```html
@if (loading()) {
  <div>Loading...</div>
}
@if (!loading()) {
  <div>Content here...</div>
}
```

### Replace *ngFor with @for

Before:
```html
<app-book-item 
  *ngFor="let book of books; trackBy: trackById" 
  [book]="book">
</app-book-item>
```

After:
```html
@for (book of books(); track book.id) {
  <app-book-item [book]="book"></app-book-item>
}

@empty {
  <div>No books available</div>
}
```

## Dependency Injection

### Use inject() Instead of Constructor Injection

Before:
```typescript
constructor(private bookApiClient: BookApiClient) {}
```

After:
```typescript
private bookApiClient = inject(BookApiClient);
```

## Observable Handling

### Proper Observable Cleanup

Before:
```typescript
ngOnInit(): void {
  this.bookApiClient.getBooks().subscribe(books => {
    this.books = books;
  });
}
```

After:
```typescript
books = signal<Book[]>([]);

constructor() {
  effect(() => {
    this.bookApiClient.getBooks().pipe(
      takeUntilDestroyed()
    ).subscribe(books => {
      this.books.set(books);
    });
  });
}
```

### Use RxJS Operators Instead of Direct Logic

Before:
```typescript
searchTimeout: any;

onSearchChange(): void {
  clearTimeout(this.searchTimeout);
  this.searchTimeout = setTimeout(() => {
    this.loadBooks(this.searchTerm);
  }, 300);
}
```

After:
```typescript
searchTerm$ = toSignal(this.searchTermControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.bookApiClient.getBooks(term))
));
```

### Use tap for Side Effects

Before:
```typescript
this.bookApiClient.getBooks().subscribe({
  next: books => {
    this.books = books;
    this.loading = false;
  },
  error: error => {
    console.error('Error fetching books:', error);
    this.loading = false;
  }
});
```

After:
```typescript
this.bookApiClient.getBooks().pipe(
  tap({
    next: books => this.books.set(books),
    error: error => console.error('Error fetching books:', error),
    finalize: () => this.loading.set(false)
  })
).subscribe();
```

## HTTP Methods

### Use Appropriate HTTP Methods

- Use PUT for full resource updates
- Use PATCH for partial updates
- Consider your API's expectations when choosing between PUT and PATCH

Example:
```typescript
// For full updates
http.put(`/api/books/${id}`, book)

// For partial updates
http.patch(`/api/books/${id}`, changes)
```

## Migration Steps

1. Start with Component State
   - Convert all component state to signals
   - Replace Input/Output decorators
   - Remove standalone flags

2. Update Templates
   - Replace *ngIf with @if
   - Replace *ngFor with @for
   - Add @empty blocks where needed

3. Modernize Dependency Injection
   - Replace constructor injection with inject()
   - Update service providers

4. Improve Observable Handling
   - Add proper cleanup with takeUntilDestroyed()
   - Replace setTimeout with RxJS operators
   - Move logic to operators like tap

5. Test and Verify
   - Ensure all signals are properly referenced with ()
   - Verify observable cleanup
   - Check for proper error handling