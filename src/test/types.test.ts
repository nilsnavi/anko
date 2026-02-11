import { describe, it, expect } from 'vitest';

// Types tests
import type { 
  User, 
  LoginCredentials, 
  ApiResponse,
  LoadingState,
  PaginatedResponse 
} from '../types';

describe('TypeScript Types', () => {
  it('should have correct User type structure', () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    };
    
    expect(user.id).toBe(1);
    expect(user.username).toBe('testuser');
    expect(user.role).toBe('admin');
  });

  it('should have correct LoginCredentials type', () => {
    const credentials: LoginCredentials = {
      username: 'admin',
      password: 'password123',
    };
    
    expect(credentials.username).toBe('admin');
    expect(credentials.password).toBe('password123');
  });

  it('should have correct ApiResponse type', () => {
    const successResponse: ApiResponse<string> = {
      data: 'success',
      success: true,
    };
    
    const errorResponse: ApiResponse<string> = {
      error: {
        message: 'Error occurred',
      },
      success: false,
    };
    
    expect(successResponse.success).toBe(true);
    expect(successResponse.data).toBe('success');
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error?.message).toBe('Error occurred');
  });

  it('should have correct LoadingState type', () => {
    const loadingState: LoadingState = {
      isLoading: true,
      error: null,
    };
    
    expect(loadingState.isLoading).toBe(true);
    expect(loadingState.error).toBeNull();
  });

  it('should have correct PaginatedResponse type', () => {
    const paginatedData: PaginatedResponse<number> = {
      data: [1, 2, 3],
      total: 100,
      page: 1,
      limit: 10,
      hasMore: true,
    };
    
    expect(paginatedData.data).toHaveLength(3);
    expect(paginatedData.total).toBe(100);
    expect(paginatedData.hasMore).toBe(true);
  });
});
