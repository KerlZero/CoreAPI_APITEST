const { test, expect } = require("@playwright/test");

// Allows testers to run the same internal API test suite against local, dev, staging, or production.
// If API_BASE_URL is not provided, the tests will use the local API server.
const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";

test.describe("Internal API Test - Profile API", () => {
  test("GET / should return API metadata", async ({ request }) => {
    // Test purpose:
    // Verify that the API root endpoint is alive and returns basic service metadata.
    const response = await request.get(`${baseUrl}/`);
    const body = await response.json();

    expect(response.status()).toBe(200);

    // Checks that the response is JSON, not an HTML error page or plain text response.
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body.message).toBe("Core Profile API");
    expect(body.endpoints).toHaveProperty("profile");
  });

  test("GET /api/profile should return success and main sections", async ({ request }) => {
    // Test purpose:
    // Verify that the full profile endpoint returns the main content sections needed by the website.
    const response = await request.get(`${baseUrl}/api/profile`);
    const body = await response.json();

    expect(response.status()).toBe(200);

    // success is the API-level business flag, separate from the HTTP status code.
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body.success).toBe(true);
    expect(body.data).toBeTruthy();

    // These are contract checks. The test does not care how the backend builds this data.
    expect(body.data).toHaveProperty("hero");
    expect(body.data).toHaveProperty("about");
    expect(body.data).toHaveProperty("timeline");
    expect(body.data).toHaveProperty("contact");
  });

  test("GET /api/profile/workSamples should return workSamples contract", async ({ request }) => {
    // Test purpose:
    // Verify that filtering by the workSamples section returns only the expected work sample contract.
    const response = await request.get(`${baseUrl}/api/profile/workSamples`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.section).toBe("workSamples");
    expect(body.data).toHaveProperty("githubProjects");
    expect(body.data).toHaveProperty("specificationSamples");

    // Array checks are important because frontend list rendering usually depends on array data.
    expect(Array.isArray(body.data.githubProjects)).toBe(true);
    expect(Array.isArray(body.data.specificationSamples)).toBe(true);
  });

  test("GET /api/profile/background should return background contract", async ({ request }) => {
    // Test purpose:
    // Verify that filtering by the background section returns credentials and education data.
    const response = await request.get(`${baseUrl}/api/profile/background`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.section).toBe("background");
    expect(body.data).toHaveProperty("credentials");
    expect(body.data).toHaveProperty("education");
    expect(Array.isArray(body.data.credentials)).toBe(true);
    expect(Array.isArray(body.data.education)).toBe(true);
  });

  test("GET /api/profile/domains should return domains contract", async ({ request }) => {
    // Test purpose:
    // Verify that filtering by the domains section returns a non-empty domain list.
    const response = await request.get(`${baseUrl}/api/profile/domains`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.section).toBe("domains");
    expect(body.data).toHaveProperty("items");
    expect(Array.isArray(body.data.items)).toBe(true);

    // This protects against an empty-but-technically-valid response that would render no content.
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("GET /api/profile/backgrond should support known alias", async ({ request }) => {
    // Test purpose:
    // Verify that a known misspelled section name is still handled and mapped to background.
    const response = await request.get(`${baseUrl}/api/profile/backgrond`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);

    // The requested URL uses "backgrond", but the API should normalize it to "background".
    expect(body.section).toBe("background");
    expect(body.data).toHaveProperty("credentials");
  });

  test("GET /api/profile/notExistingSection should return error contract", async ({ request }) => {
    // Test purpose:
    // Verify that an invalid section returns a controlled API error, not a crash or HTML error page.
    const response = await request.get(`${baseUrl}/api/profile/notExistingSection`);
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body.success).toBe(false);
    expect(body.message).toContain("not found");

    // availableSections helps frontend/testers debug which section names are valid.
    expect(Array.isArray(body.availableSections)).toBe(true);
    expect(body.availableSections).toContain("workSamples");
    expect(body.availableSections).toContain("background");
    expect(body.availableSections).toContain("domains");
  });
});
