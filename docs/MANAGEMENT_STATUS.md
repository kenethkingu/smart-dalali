# Proland Management Module: Status

## Phase 0 audit (before this session)

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | Roles `tenant`, `agent`, property manager | PARTIAL | `src/lib/rbac.ts` had the roles (`property_manager`, not `propertyManager`) but no `can(user, action, resource)`, only `canAccess(role, permission)`. Users had a single role. |
| 2 | Types (Lease, RentPayment, MaintenanceTicket, PropertyDocument, Contract, Inspection, TransactionEvent, Building) | PARTIAL | Only `Building`, `TransactionEvent` (with a stored finished sentence) and optional `buildingId` / `unitNumber` existed in `src/types/index.ts`. |
| 3 | Phase A event log | PARTIAL | `src/lib/events.tsx` held an in-memory `addEvent`; four call sites wrote to it. `/properties/:id/history` existed but was public, unpaginated, English only, and not grouped by month. |
| 4 | Phase B lease and Tenant dashboard | MISSING | No lease, no tenant dashboard. `OwnerRequests` kept a private copy of requests, so owner confirmations never reached the buyer. Visit requests from the property page created only an event, never a request. |
| 5 | Phase C rent, maintenance, tenancies, renewal | MISSING | None present. |
| 6 | Phase D documents, contracts, verification | MISSING | None present. |
| 7 | Cross-cutting | PARTIAL | i18n and dark tokens existed for the old pages. `ProtectedRoute` redirected to `/login` without a return path. |
| 8 | Dead ends | PARTIAL | `Navbar` linked property managers to `/property_manager/dashboard` (404). The sidebar had no links for property managers. `BuyerDashboard` and `BuyerRequests` showed `buyer1` requests to every user. |

## Final status

| Phase | Status |
|-------|--------|
| A Transaction timeline | DONE |
| B Tenant role and lease creation | DONE |
| C Rent, maintenance, tenancies, renewal | DONE |
| D Documents, contracts, admin verification, inspections | DONE |

Verification was static only: `npx tsc --noEmit -p tsconfig.app.json` is clean. ESLint reports nothing in new or changed management code. The remaining ESLint findings are older ones in files outside this work (`any` in filters, `Date.now` in `OwnerDashboard` and `OwnerRequests`, `rules-of-hooks` in `PropertyForm`, and `react-refresh` on `auth.tsx` and `requests.tsx`, which keep the provider-plus-hook layout they had). The default ESLint formatter crashes on Node 20.11, so lint with `npx eslint src -f json`.

## How it works

- One persisted store, `proland.management.v1`, in `src/services/management/store.ts`. It seeds itself on first load and passes stored data through `migrate`, so a changed shape never breaks a returning user.
- One `can(user, action, resource)` in `src/lib/rbac.ts`. Routes, hooks and services all use it.
- One `recordEvent` in `eventLog.ts`. The four existing call sites now write through it.
- Rent status is derived in `src/lib/rentStatus.ts` and never stored.
- `leaseService.createLeaseFromRequest` is the only place a lease is created. It is called from `RequestsProvider.updateRequest` when a request becomes `payment_confirmed`, and it is idempotent per request. Only rental properties produce a lease. A property with an active or pending lease refuses a second one.
- The tenant role is derived: `AuthProvider` adds `tenant` to `user.roles` while the user has a lease, and keeps their original role (so a tenant is still a buyer).
- The payment-method selector now lives in `components/shared/PaymentMethodPicker.tsx` and is used by both the site-visit dialog and the rent sheet.

## Files created

```
docs/MANAGEMENT_STATUS.md
src/types/management.ts
src/lib/{confetti,dateFormat,ids,money,objectUrls,paginate,rentStatus}.ts
src/components/layout/dashboardLinks.ts
src/components/shared/PaymentMethodPicker.tsx
src/data/management/{contracts,documents,events,inspections,leases,seed,tickets,time}.ts
src/services/management/{contractService,documentService,eventLog,inspectionService,leaseService,maintenanceService,rentSchedule,rentService,shared,store,tenantRole,titleBadge}.ts
src/hooks/management/{useContract,useDocuments,useInspections,useLeases,useOwnerSummary,usePagedList,usePayments,usePropertyAccess,usePropertyEvents,useTickets}.ts
src/features/management/shared/*   (AccessDenied, DocumentList, DocumentUploadForm, EmptyState, FilterTabs, FormField, formStyles, InlineNotice, MetaBadge, NotFoundState, PageHeader, PageSkeleton, Pagination, PropertyLabel, StatusBadge, statusMeta, SuccessCheck, TicketDetailSheet, TicketRow, Timeline, errors)
src/features/management/tenant/*   (AgreementPage, HomeCard, LatestActivity, LeaseSummary, LeaseSwitcher, NextRentCard, OpenTicketsCard, PayRentSheet, PhotoPicker, ReceiptDialog, RenewalOfferCard, TenantDashboardPage, TenantDocumentsPage, TenantMaintenanceNewPage, TenantMaintenancePage, TenantRentPage, useActiveLease)
src/features/management/owner/*    (LeaseActionDialogs, OwnerDocumentsPage, OwnerMaintenancePage, OwnerSummaryStrip, RentLedger, TenanciesPage, TenancyDetailPage)
src/features/management/admin/*    (DocumentReviewDialog, VerificationPage)
src/features/management/history/*  (InspectionDialog, InspectionList, PropertyHistoryPage)
```

## Files modified

`src/App.tsx`, `src/index.css` (print rules), `src/types/index.ts`, `src/data/mockData.ts` (apartment `p5`, `userDirectory`, tenant and property manager demo users, `managerId` on `p1`, request `v4` moved to `p5` and `tenant1`, old event seeds removed), `src/lib/{auth,rbac,requests}.ts(x)`, `src/lib/locales/{en,sw}.json`, `src/pages/Login.tsx`, `src/pages/PropertyDetail.tsx`, `src/pages/buyer/{BuyerDashboard,BuyerRequestDetail,BuyerRequests}.tsx`, `src/pages/owner/{OwnerDashboard,OwnerProperties,OwnerRequests}.tsx`, `src/components/auth/LoginForm.tsx`, `src/components/buyer/{ConfirmPaymentDialog,RequestVisitDialog,VisitRequestCard}.tsx`, `src/components/layout/{DashboardShell,Navbar,ProtectedRoute}.tsx`.

## Files removed

`src/lib/events.tsx` (replaced by the event log service and hooks) and `src/pages/PropertyHistory.tsx` (replaced by `features/management/history/PropertyHistoryPage.tsx`).

## Behavior changes to existing code

- `ProtectedRoute` now sends signed-out visitors to `/login?redirectTo=...` and shows an access-denied page to signed-in users without permission (it used to redirect them to `/login`). The login page honours `redirectTo` over the demo-login destination.
- The visit dialog now creates a real request. The owner's Confirm button now updates the shared request, so the buyer sees it. Owners see only requests on their own properties.
- Requests persist under `proland.requests.v1`, so a lease and its request stay consistent after a reload.
- `BuyerDashboard` and `BuyerRequests` no longer include `buyer1` requests for other users.
- The site-visit payment dialog uses the shared picker. Its step 2 heading is now a sub-heading and its strings are translated. Its confetti reads theme colours instead of hex values.
- `DashboardShell` shows a link strip on phones (the sidebar was desktop only) and wraps pages in `Suspense`.
- The history link on the property page shows only to people who may open the history.
- `OwnerDashboard` gained the summary strip. Nothing else on it changed.

## Intentionally not built or different

- No swipe interaction in verification: the existing admin queue had none. It reuses that queue's card list and animation, with Preview, Reject (reason of at least 10 characters) and Approve.
- Extra event types for renewals (`renewal_offered`, `renewal_accepted`, `renewal_declined`) so the timeline reads correctly.
- Inspections have no standalone dashboard, as asked. They are recorded from a dialog on the property history page and listed there. The owner reaches that page from a History link on each listing in My Properties.
- Photos and documents keep only metadata after a reload (object URLs do not survive). The UI says the preview is unavailable instead of showing a broken image.
- The signed agreement is added to the vault as a platform-generated entry (no file) that opens the agreement page.
- Role id is `property_manager` (existing) rather than `propertyManager`.
- Swahili is flagged for native-speaker review through `management._reviewed: false` in `sw.json`. Review first: rent receipts, the agreement clauses, and the signature preview notice.
- Access is not persisted across reloads, because the existing demo login does not persist it.

## Manual test script (Chrome)

Use the "Quick Access Login" buttons on `/login`.

1. Log in as **Buyer** (Amina Hassan). Open `/buyer/dashboard`. The request for the Sinza house (`p1`) shows a countdown and a Confirm payment button.
2. Open the Sinza house on `/properties`, tap Request Site Visit, and send it. You still see the same pending request (no duplicate).
3. Tap Confirm payment on the Sinza request, pick a mobile money option, enter any number, and confirm. Confetti plays. A **My Home** link appears on the card and in the sidebar and top bar.
4. Open **My Home** (`/tenant/dashboard`). You see the Sinza house, an "awaiting signatures" notice and a disabled path to pay (rent says to sign first).
5. Open the agreement, tick consent, type "Amina Hassan", and sign. It says you are waiting for the owner. Log out.
6. Log in as **Owner** (John Mwakalinga). The dashboard shows the new summary strip. Open **Tenancies**, open Amina's tenancy, open the agreement, type "John Mwakalinga", sign. The tenancy becomes Active and the agreement appears in Documents.
7. Log out, log in as **Buyer** again, open **My Home**, and tap Pay rent. Pay with M-Pesa. Check the success tick, then open the receipt and print preview.
8. Open **Maintenance**, tap Report an issue, leave the title empty and move off the field to see the inline error. Fill it in with a photo and send. Log out.
9. Log in as **Owner**, open **Maintenance**, open the ticket, set it In progress with a note, save, then set it Resolved.
10. Log in as **Buyer**, open the ticket, and tap Not fixed (it reopens) or Fixed.
11. As **Buyer**, open **Documents**, upload a PDF or image under 5 MB (a larger file or another type shows an error). Log out.
12. Log in as **Admin**, open **Verification**, preview the new document and Approve it. Reject another with a short reason to see the validation, then with a longer one.
13. Verify the seeded Masaki title deed. The Title Verified badge appears on that listing's card once it is approved and visible.
14. Open `/properties/p1/history` as Owner, Admin or the tenant. You see the whole story in month groups with relative times. A buyer without a lease gets the access-denied page.
15. Log in as **Property Manager** (Zawadi Komba). Open **Tenancies**, **Maintenance**, then the history page of the Masaki apartment and record an inspection.
16. Log in as **Tenant** (Baraka Mushi, seeded with an active Masaki lease). Check the overdue rent note, the open and resolved tickets, a renewal flow (as John, offer a renewal on the Masaki tenancy, then accept or decline as Baraka), and switch the language to Kiswahili on each screen. Toggle dark mode on each screen.

Seeded accounts: Buyer = Amina Hassan, Owner = John Mwakalinga (owns `p1`, `p5`), Admin = Proland Admin, Tenant = Baraka Mushi (lease on `p5`), Property Manager = Zawadi Komba (manages `p1`, `p5`).
