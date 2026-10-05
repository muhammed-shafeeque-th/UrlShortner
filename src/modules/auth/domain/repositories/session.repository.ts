import { RefreshSession } from '../entities/refresh-session';

export abstract class SessionRepository {
  abstract create(session: RefreshSession): Promise<void>;
  abstract findByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
  /** Atomically revokes the session if still active. Returns true if this call revoked it. */
  abstract revokeIfActive(id: string): Promise<boolean>;
  abstract revokeAllForUser(userId: string): Promise<void>;
}
