/**
 * Frontend-only mode. When `NEXT_PUBLIC_AUTH_MOCK=1`, every server action and
 * OAuth click short-circuits to a fake-success response — no Supabase calls,
 * no Twilio. Lets the design/UX be exercised end-to-end without provisioning
 * accounts. Flip the env var off (or unset) to restore real backend behaviour.
 */
export const IS_AUTH_MOCK = process.env.NEXT_PUBLIC_AUTH_MOCK === "1";

/** Tiny artificial delay so mock loading states get a chance to show. */
export const MOCK_LATENCY_MS = 450;

export function mockDelay(ms = MOCK_LATENCY_MS): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Demo OTP code accepted in mock mode. */
export const MOCK_OTP = "123456";
