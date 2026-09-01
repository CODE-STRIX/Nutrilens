import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRegistrationDto, UserLoginDto, AuthResponse, UserProfile } from '../../../shared/types/user';
import { UserStore, UserRecord } from '../models/userStore';

const JWT_SECRET = process.env.JWT_SECRET || 'nutrilens_jwt_secret_key_default_secure';

export const UserService = {
  register: async (dto: UserRegistrationDto): Promise<AuthResponse> => {
    const existing = UserStore.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newRecord: UserRecord = {
      id: userId,
      email: dto.email,
      name: dto.name,
      passwordHash,
      age: dto.age || 30,
      healthConditions: dto.healthConditions || [],
      allergies: dto.allergies || [],
      goals: dto.goals || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    UserStore.create(newRecord);

    const token = jwt.sign({ userId: newRecord.id, email: newRecord.email }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...profile } = newRecord;

    return { token, user: profile };
  },

  login: async (dto: UserLoginDto): Promise<AuthResponse> => {
    const record = UserStore.findByEmail(dto.email);
    if (!record) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, record.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: record.id, email: record.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...profile } = record;

    return { token, user: profile };
  },

  getProfile: (userId: string): UserProfile => {
    const record = UserStore.findById(userId);
    if (!record) {
      throw new Error('User not found');
    }

    const { passwordHash: _, ...profile } = record;
    return profile;
  },

  updateProfile: (userId: string, updates: Partial<UserProfile>): UserProfile => {
    const updated = UserStore.update(userId, updates);
    if (!updated) {
      throw new Error('User not found');
    }

    return updated;
  }
};
