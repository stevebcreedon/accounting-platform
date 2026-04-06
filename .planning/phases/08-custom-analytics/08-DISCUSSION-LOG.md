# Phase 8: Custom Analytics - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-04-06
**Phase:** 08-custom-analytics
**Areas discussed:** Page view tracking, Article read tracking, Outbound click tracking, Aggregation & storage

---

## Page View Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side beacon (Recommended) | POST on mount, works with SSG | ✓ |
| Middleware-based | Server-side intercept | |
| You decide | | |

**User's choice:** Client-side beacon

## Article Read Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Scroll depth threshold (Recommended) | 75% scroll via Intersection Observer | ✓ |
| Time-based (30 seconds) | Fire after 30s | |
| Both combined | 50% scroll + 15s | |
| You decide | | |

**User's choice:** Scroll depth threshold (75%)

## Outbound Click Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Event listener on external links (Recommended) | Intercept clicks, fire beacon | ✓ |
| Navigator.sendBeacon only | Fire-and-forget | |
| You decide | | |

**User's choice:** Event listener on external links

## Aggregation & Storage

| Option | Description | Selected |
|--------|-------------|----------|
| SQL views + Vercel cron (Recommended) | Views + daily rollup route | ✓ |
| Materialized views with pg_cron | Database-native refresh | |
| Application-level only | Query raw tables | |
| You decide | | |

**User's choice:** SQL views + Vercel cron

## Claude's Discretion

- Bot list, beacon placement, marker positioning, click delegation, SQL views, cron schedule, country detection

## Deferred Ideas

None
