# Reviews and Audit Snapshots

Purpose

- This directory holds short-lived, human-readable summaries of review/audit activities (e.g., prompt audits, agentic reviews).
- Do NOT commit full snapshot artifacts (baselines, transcripts, copied docs) to main.

Policy

- Commit a tiny summary only (this README plus a short dated note if needed).
- Store heavy artifacts elsewhere:
  - context/temp-agent-outputs/ (already git-ignored) for local scratch
  - PR attachments or GitHub gists for sharing
  - A separate, throwaway branch if you must track artifacts in git temporarily
- If a future audit requires a baseline, link to the source files in the repo rather than copying them here.

Recommended record format

- context/reviews/YYYY-MM-DD-<name>.md containing:
  - Title and date
  - Purpose and scope
  - Key findings and action items
  - Links to relevant PR(s) and issues
  - Where to find artifacts (PR attachments, temp-agent-outputs, external link)
