import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserData {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      } @else {
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <img
              [src]="user().avatarUrl"
              [alt]="user().name"
              class="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
            <div class="absolute bottom-0 right-0">
              <button
                (click)="toggleEditMode()"
                class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  @if (isEditing()) {
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  } @else {
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    />
                  }
                </svg>
              </button>
            </div>
          </div>

          <div class="text-center space-y-2 w-full">
            <h2 class="text-2xl font-bold text-gray-800">{{ user().name }}</h2>
            <p class="text-gray-600">{{ user().email }}</p>
            <p class="text-gray-700 max-w-md mx-auto">{{ user().bio }}</p>
          </div>

          @if (isEditing()) {
            <div class="space-y-4 w-full max-w-md">
              <div class="flex justify-end">
                <button
                  (click)="saveChanges()"
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
    }
  `
})
export class UserProfile {
  private initialUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software engineer passionate about web development and user experience.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  };

  loading = signal(false);
  isEditing = signal(false);
  user = signal<UserData>(this.initialUserData);

  // Computed values can be added here for derived state
  fullName = computed(() => {
    const userData = this.user();
    return userData.name;
  });

  toggleEditMode(): void {
    this.isEditing.update(value => !value);
  }

  async saveChanges(): Promise<void> {
    this.loading.set(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isEditing.set(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
