# Awesome Project Build with TypeORM

Steps to run this project:

1. Setup database settings inside `data-source.ts` file
2. Run `docker compose up` command
3. Run `npm run migration` command inside the root dir for the migrations.
   <!-- 4. to create migration `npx typeorm migration:generate ./src/migrations/AddIndexToCampaignTitle -d ./build/data-source.js` -->
   <!-- to run migrations `npm run migration` -->
