# DATAVERSE participant registration chatbot

The public participant experience is a guided, deterministic chatbot. It does not use an LLM. Each participant has one profile identified by their verified mobile number.

## Participant login on another device

A returning participant can type `login` in the chat (or choose the Login quick action), enter the mobile number used for registration, and verify the one-time SMS code. The verification creates a new 12-hour HttpOnly registration session on that browser/device and restores the participant's saved profile and event registrations. Logging in on another device does not invalidate an existing device session.

A mobile number by itself is not sufficient to log in. SMS delivery must be configured with `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` and a random `OTP_HASH_SECRET` of at least 32 characters. Login OTPs are rate-limited, expire after five minutes and allow at most five verification attempts. Login is not date-gated.

The browser chat transcript itself is not currently synchronised between devices; login restores the participant profile and event registration state.

## Registration flow

1. Collect college, city, department, contact name and mobile number.
2. Store the contact as a participant and create a private 12-hour registration-flow cookie.
3. Show the eight event cards and their rulebook team-size limits.
4. Collect each team member's name and mobile number.
5. Validate team size, eligible department, two-events-per-person limit, and college/department team limits.
6. Save each person with a stable person ID and save each event team with a separate internal registration reference. Neither identifier is returned during initial registration.

A participant is treated as part of the team only when their details are included in the event's team-member dialog. The contact can register a team without being a team member.

## College autocomplete

The local autocomplete snapshot is compiled from the Greater Chennai Corporation's category-wise college directory, the Tamil Nadu Directorate of Collegiate Education register, and Anna University's Chennai-headquarters district-wise affiliated engineering college lists. It includes Chennai and nearby Chennai-region locations such as Tambaram, Avadi, Poonamallee, Sriperumbudur, Kelambakkam, Chengalpattu, Kanchipuram and Tiruvallur. It is not a guaranteed national or exhaustive government master list; manual entry remains available for unlisted colleges.

Sources:
- Anna University Centre for Affiliation of Institutions (Chennai region: Chennai, Chengalpattu, Kancheepuram and Tiruvallur): https://www.annauniv.edu/cai/index.php
- Greater Chennai Corporation: https://chennaicorporation.gov.in/gcc/about-GCC/about-chennai/colleges/
- Tamil Nadu Directorate of Collegiate Education: https://tndce.tn.gov.in/Colleges
- Tamil Nadu Government Arts and Science 2026 college list: https://static.tneaonline.org/docs/arts/tngasa_booklet_2026.pdf

## Required environment variables

The existing MONGODB_URI is required.

ID retrieval stays disabled until DATAVERSE_ID_LOOKUP_ENABLED_AT is set to an ISO date/time, for example:

DATAVERSE_ID_LOOKUP_ENABLED_AT=2026-12-05T00:00:00+05:30

Participant login uses one-time verification codes whenever these SMS settings are configured. Person-ID lookup also uses the same SMS provider, but its availability remains separately date-gated. Configure Twilio:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_FROM_NUMBER
- OTP_HASH_SECRET (recommended; use a long random value)

Test SMS delivery before using participant login or enabling ID retrieval. Login verifies the mobile number by OTP before creating a participant session. The ID lookup endpoint separately verifies the mobile number before returning a person ID.

## College directory scope

The autocomplete directory is a maintained snapshot of the public lists linked above, covering colleges in Chennai and the nearby Chennai, Chengalpattu, Kancheepuram and Tiruvallur districts, plus category listings published by GCC. These registries have different scopes and update cycles, so the snapshot cannot guarantee every currently operating institution or every campus. Participants can always type their institution manually; organisers should review new entries before event day.

## Settings and event rules

The public registration API checks the DATAVERSE Settings record. Registration is open only when registrationEnabled is true, maintenance mode is off, and the configured deadline has not passed. If no settings record exists, registration defaults to closed. The first seed also initializes registration as closed, so an admin must explicitly open it.

## Admin dashboard

- Open `/admin/login` and sign in using the seeded admin account.
- The dashboard is available at `/admin`.
- The global registration gate opens or closes all public event submissions.
- Each event has a separate registration switch. Turning one event off does not close the others.
- The registrations table shows registration reference, event, college, city, department, team members and mobile numbers. It supports searching, event/status filters, pagination and CSV export of the current page.
- Dashboard APIs require the existing admin session and the permissions `settings:manage`, `events:manage` and `registrations:view`. The seeded superadmin has all permissions.
- Seed the first admin using `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` and `SEED_ADMIN_NAME`, then run `npm run seed`.
- Rerunning the seed updates event details but preserves each event's registration switch and the global registration setting.

The current rulebook rules are encoded in src/data/events.ts and enforced server-side. If organisers change team sizes or restrictions, update the event catalog and this validation together.

## Notes for organisers

- No participant password is created; participant access is through mobile-number OTP verification.
- Each device gets its own HttpOnly, Secure-in-production, SameSite Strict flow cookie that expires after 12 hours.
- Person IDs and event registration references are not included in public registration responses.
- The two-event limit is checked against all confirmed registrations. Configure MongoDB with a replica set (MongoDB Atlas is suitable) before launch, and test concurrent registration traffic.
- Keep a separate staff/admin account system for organiser operations.
