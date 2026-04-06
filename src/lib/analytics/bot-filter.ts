import { isbot } from 'isbot';

export function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return isbot(userAgent);
}
