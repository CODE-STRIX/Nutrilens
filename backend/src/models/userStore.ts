import { UserProfile } from '../../../shared/types/user';
import bcrypt from 'bcryptjs';

export interface UserRecord extends UserProfile {
  passwordHash: string;
}

const users: Map<string, UserRecord> = new Map();

// Seed a default test user for SIH demo: Rahul Sharma with Hypertension & Peanut Allergy
const seedDemoUsers = () => {
  const demoUserId = 'usr-demo-rahul';
  const hashedPassword = bcrypt.hashSync('Password123!', 8);
  
  users.set(demoUserId, {
    id: demoUserId,
    email: 'rahul.sharma@example.com',
    name: 'Rahul Sharma',
    passwordHash: hashedPassword,
    age: 42,
    healthConditions: ['Hypertension', 'HighCholesterol'],
    allergies: ['Peanuts'],
    goals: ['LowSodium', 'HeartHealth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const demoUser2 = 'usr-demo-priya';
  users.set(demoUser2, {
    id: demoUser2,
    email: 'priya.patel@example.com',
    name: 'Priya Patel',
    passwordHash: hashedPassword,
    age: 34,
    healthConditions: ['Type2Diabetes', 'Celiac'],
    allergies: ['Gluten'],
    goals: ['LowSugar', 'WeightLoss'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

seedDemoUsers();

export const UserStore = {
  findByEmail: (email: string): UserRecord | undefined => {
    return Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  findById: (id: string): UserRecord | undefined => {
    return users.get(id);
  },

  create: (userRecord: UserRecord): UserRecord => {
    users.set(userRecord.id, userRecord);
    return userRecord;
  },

  update: (id: string, updates: Partial<UserProfile>): UserProfile | null => {
    const existing = users.get(id);
    if (!existing) return null;

    const updated: UserRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    users.set(id, updated);
    
    // Omit passwordHash for returned UserProfile
    const { passwordHash, ...profile } = updated;
    return profile;
  },

  getAllProfiles: (): UserProfile[] => {
    return Array.from(users.values()).map(({ passwordHash, ...profile }) => profile);
  }
};
