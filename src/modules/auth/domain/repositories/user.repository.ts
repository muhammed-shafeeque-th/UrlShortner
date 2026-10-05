import { User } from '../entities/user';

export abstract class UserRepository {
  /** @throws `EmailAlreadyRegisteredError` on unique violation */
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
