# Backend Logging Standards
All server-side modules must follow these logging levels:
- **DEBUG**: Verbose flow information for local development.
- **INFO**: General system milestones (Server started, DB connected).
- **WARN**: Non-critical issues (API rate limiting hit).
- **ERROR**: Critical failures requiring immediate attention.

*Note: Avoid logging PII (Personally Identifiable Information) in production.*