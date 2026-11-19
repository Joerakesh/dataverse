# DATAVERSE participant registration chatbot

The public participant experience is a guided, deterministic chatbot. It does not use an LLM or require participant accounts.

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

To send one-time verification codes after enabling ID retrieval, configure Twilio:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_FROM_NUMBER
- OTP_HASH_SECRET (recommended; use a long random value)

Do not enable ID retrieval until the SMS credentials have been configured and tested. The lookup endpoint verifies the mobile number by OTP before returning a person ID.

## College directory scope

The autocomplete directory is a maintained snapshot of the public lists linked above, covering colleges in Chennai and the nearby Chennai, Chengalpattu, Kancheepuram and Tiruvallur districts, plus category listings published by GCC. These registries have different scopes and update cycles, so the snapshot cannot guarantee every currently operating institution or every campus. Participants can always type their institution manually; organisers should review new entries before event day.

## Settings and event rules

The public registration API checks the existing DATAVERSE Settings record. Registration is open when registrationEnabled is true, maintenance mode is off, and the configured deadline has not passed. If no settings record exists, the public flow defaults to open; set the settings record before launch.

The current rulebook rules are encoded in src/data/events.ts and enforced server-side. If organisers change team sizes or restrictions, update the event catalog and this validation together.

## Notes for organisers

- No participant dashboard or participant password is created.
- The flow cookie is HttpOnly, Secure in production, SameSite Strict and expires after 12 hours.
- Person IDs and event registration references are not included in public registration responses.
- The two-event limit is checked against all confirmed registrations. Configure MongoDB with a replica set (MongoDB Atlas is suitable) before launch, and test concurrent registration traffic.
- Keep a separate staff/admin account system for organiser operations.
