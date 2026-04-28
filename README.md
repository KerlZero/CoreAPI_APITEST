# Core Profile API

Simple Node.js + Express API for serving profile data to a website, with Postman collections and Playwright API tests.

## Project Structure

```text
src/
  server.js
  data/
    profile.js
tests/
  api/
    internal/
      profile.internal.spec.js
    external/
      github.external.spec.js
      reqres-playwright-api-test/
        reqres.api.spec.ts
postman/
  CoreProfileAPI.postman_collection.json
  CoreProfileAPI.local.postman_environment.json
playwright.config.js
package.json
```

## Install

Common command:

```bash
npm install
```

Windows PowerShell fallback:

```bash
npm.cmd install
```

Use `npm.cmd` if PowerShell blocks `npm.ps1` or `npx.ps1`.

## Run API

Common command:

```bash
npm run dev
```

Windows PowerShell fallback:

```bash
npm.cmd run dev
```

Local API:

```text
http://localhost:3000
```

## API Endpoints

```text
GET /
GET /api/profile
GET /api/profile/:section
```

Full profile:

```text
http://localhost:3000/api/profile
```

Section examples:

```text
http://localhost:3000/api/profile/hero
http://localhost:3000/api/profile/about
http://localhost:3000/api/profile/timeline
http://localhost:3000/api/profile/domains
http://localhost:3000/api/profile/background
http://localhost:3000/api/profile/workSamples
http://localhost:3000/api/profile/contact
```

Available section names:

```text
meta
navigation
hero
about
notes
timelineOverview
timeline
domains
background
workSamples
contact
footer
source
```

## Postman

Postman files:

```text
postman/CoreProfileAPI.postman_collection.json
postman/CoreProfileAPI.local.postman_environment.json
```

Import both files into Postman, select the `Core Profile API - Local` environment, then run the API.

Collection requests:

```text
GET {{baseUrl}}/
GET {{baseUrl}}/api/profile
GET {{baseUrl}}/api/profile/workSamples
GET {{baseUrl}}/api/profile/background
GET {{baseUrl}}/api/profile/domains
GET {{baseUrl}}/api/profile/backgrond
GET {{baseUrl}}/api/profile/unknown
```

## Playwright API Tests

The Playwright tests use a tester/black-box style:

```text
Know only the base URL, endpoint, method, expected status, and expected response contract.
Do not import backend files.
Do not read src/data/profile.js.
Do not depend on backend implementation details.
```

Projects:

```text
internal-api = API owned by this project
external-api = 3rd-party API examples
```

## Test Commands

Common commands:

```bash
npm run test:api:internal
npm run test:api:external
npm run test:api:reqres
```

Windows PowerShell fallback:

```bash
npm.cmd run test:api:internal
npm.cmd run test:api:external
npm.cmd run test:api:reqres
```

Avoid running `npx playwright test` in PowerShell on this machine because `npx.ps1` may be blocked by Execution Policy. If you need direct execution, use:

```bash
npx.cmd playwright test
```

## Internal API Tests

File:

```text
tests/api/internal/profile.internal.spec.js
```

Start the API first:

```bash
npm run dev
```

Then run:

```bash
npm run test:api:internal
```

Default internal base URL:

```text
http://localhost:3000
```

Override internal base URL:

```powershell
$env:API_BASE_URL="https://dev-api.example.com"
npm.cmd run test:api:internal
```

Internal test cases:

```text
GET /
GET /api/profile
GET /api/profile/workSamples
GET /api/profile/background
GET /api/profile/domains
GET /api/profile/backgrond
GET /api/profile/notExistingSection
```

## External API Tests - GitHub

File:

```text
tests/api/external/github.external.spec.js
```

Run:

```bash
npm run test:api:external
```

Default values:

```text
EXTERNAL_GITHUB_API_BASE_URL=https://api.github.com
EXTERNAL_GITHUB_USER=KerlZero
EXTERNAL_GITHUB_REPO=Automation-Test
```

Override values:

```powershell
$env:EXTERNAL_GITHUB_API_BASE_URL="https://api.github.com"
$env:EXTERNAL_GITHUB_USER="KerlZero"
$env:EXTERNAL_GITHUB_REPO="Automation-Test"
npm.cmd run test:api:external
```

GitHub test cases:

```text
GET /users/{username}
GET /repos/{owner}/{repo}
GET /repos/{owner}/not-existing-repo-for-api-test
```

## External API Tests - ReqRes

File:

```text
tests/api/external/reqres-playwright-api-test/reqres.api.spec.ts
```

Run:

```bash
npm run test:api:reqres
```

Windows PowerShell fallback:

```bash
npm.cmd run test:api:reqres
```

Direct command fallback:

```bash
npx.cmd playwright test tests/api/external/reqres-playwright-api-test/reqres.api.spec.ts --project=external-api
```

Required environment values can be set in `.env`:

```env
REQRES_BASE_URL=https://reqres.in
REQRES_API_KEY=reqres-free-v1
```

ReqRes test cases:

```text
GET /api/users/2
- Expected status: 200
- Expected user data exists

GET /api/users/999
- Expected status: 404
- Expected empty response body

POST /api/users
- Expected status: 201
- Expected created user data

POST /api/login
- Expected status: 200
- Expected token exists

POST /api/login without password
- Expected status: 400
- Expected error exists
```

## Notes for 3rd-party API Testing

For 3rd-party APIs, avoid asserting volatile values:

```text
star count
fork count
timestamps
descriptions
rate limit numbers
```

Prefer stable contract checks:

```text
status code
content type
required fields
field data types
business-critical identifiers
controlled error response
```
