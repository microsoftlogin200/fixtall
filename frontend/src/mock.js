// Mock data for Microsoft-style authentication

export const mockUsers = [
  {
    id: '1',
    email: 'mancando1000@gmail.com',
    password: 'Password123!',
    name: 'John Doe',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'demo@microsoft.com',
    password: 'Demo123!',
    name: 'Demo User',
    createdAt: new Date('2024-02-20')
  }
];

// Mock authentication functions
export const mockAuthenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve({
          success: true,
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + Date.now()
        });
      } else {
        reject({
          success: false,
          message: 'Your account or password is incorrect. If you don\'t remember your password, reset it now.'
        });
      }
    }, 800);
  });
};

export const mockCheckEmail = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      resolve({
        exists: !!user,
        email: email
      });
    }, 500);
  });
};

export const mockRegister = (email, password, name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        reject({
          success: false,
          message: 'That email address is already taken.'
        });
      } else {
        const newUser = {
          id: String(mockUsers.length + 1),
          email,
          password,
          name,
          createdAt: new Date()
        };
        mockUsers.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        resolve({
          success: true,
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + Date.now()
        });
      }
    }, 800);
  });
};

export const mockResetPassword = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        resolve({
          success: true,
          message: 'If that email address is in our database, we will send you an email to reset your password.'
        });
      } else {
        // Still return success for security (don't reveal if email exists)
        resolve({
          success: true,
          message: 'If that email address is in our database, we will send you an email to reset your password.'
        });
      }
    }, 800);
  });
};