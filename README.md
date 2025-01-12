Steps to run this project:
1. rename .env.local to .env
2. Run `docker compose up` command


Steps to create and run migration
1. Run `npm run migration` command inside the root dir for the migrations.
2. to create migration `npx typeorm migration:generate ./src/migrations/AddIndexToCampaignTitle -d ./build/data-source.js`
   to run migrations `npm run migration`

 <!-- enhancements
 1. Integration with Monitoring Tools (sentr, datadog)
 2. Request Tracking for Debugging, use request id (using middleware like express-request-id) to find correlated errors
 3. Use log levels (e.g., info, warn, error)
 4. Rate Limiting or Retry After Failures. -->
