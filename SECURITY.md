# Security Policy

## Scope

NEXUS-7 is a synthetic demonstration. It intentionally contains no production credentials, real user records, payment data, infrastructure control, or external AI model access.

Security fixes are supported for the current `0.1.x` experiment while the repository remains active.

## Reporting

Use the repository's private **Report a vulnerability** channel when it is available. Do not publish credentials, exploit payloads, or sensitive reproduction data in a public issue. If private reporting is unavailable, open a minimal issue titled `Security contact request` without technical exploit details.

Include the affected path, impact, minimal reproduction steps, and suggested mitigation. Reports should target the actual code in this repository; synthetic labels and intentionally non-production behavior are not vulnerabilities by themselves.

## Implemented controls

- No committed secrets or required third-party tokens.
- Same-origin content policy, frame denial, MIME sniffing protection, restrictive browser permissions, and referrer controls.
- Production CSP excludes `unsafe-eval`; development enables it only for the framework debugging runtime.
- Bounded JSON request bodies and predictable validation errors.
- React text rendering without raw HTML injection.
- Schema-versioned, allowlisted local persistence and import rejection.
- Deterministic assistant actions limited to an explicit navigation allowlist.
- Synthetic-only mutations with visible reset and export paths.

## Not production controls

This version does not provide authentication, authorization, rate limiting, bot detection, tenant isolation, database encryption, key rotation, immutable remote audit storage, or third-party penetration testing. Any production fork must add those controls before accepting real users or exposing write APIs.
