export type HealthCondition = 
  | 'Hypertension'
  | 'Type2Diabetes'
  | 'HighCholesterol'
  | 'GERD'
  | 'KidneyDisease'
  | 'Celiac';

export type Allergy = 
  | 'Peanuts'
  | 'Gluten'
  | 'Dairy'
  | 'Soy'
  | 'TreeNuts'
  | 'Sulfites';

export type DietaryGoal = 
  | 'WeightLoss'
  | 'LowSodium'
  | 'LowSugar'
  | 'HighProtein'
  | 'HeartHealth'
  | 'GutHealth';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  healthConditions: HealthCondition[];
  allergies: Allergy[];
  goals: DietaryGoal[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistrationDto {
  email: string;
  password: string;
  name: string;
  age?: number;
  healthConditions?: HealthCondition[];
  allergies?: Allergy[];
  goals?: DietaryGoal[];
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
