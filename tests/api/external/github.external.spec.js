const { test, expect } = require("@playwright/test");

// External API tests use configurable values because 3rd-party environments can differ by team.
// These defaults use public GitHub API endpoints related to the profile work samples.
const githubBaseUrl = process.env.EXTERNAL_GITHUB_API_BASE_URL || "https://api.github.com";
const githubUser = process.env.EXTERNAL_GITHUB_USER || "KerlZero";
const githubRepo = process.env.EXTERNAL_GITHUB_REPO || "Automation-Test";

test.describe("External API Test - GitHub API", () => {
  test("GET /users/{username} should return public user contract", async ({ request }) => {
    // Test purpose:
    // Verify that the 3rd-party user profile endpoint is reachable and returns the expected public contract.
    const response = await request.get(`${githubBaseUrl}/users/${githubUser}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    // External APIs can change optional fields, so this test checks stable contract fields only.
    expect(body.login).toBe(githubUser);
    expect(body).toHaveProperty("html_url");
    expect(body).toHaveProperty("repos_url");
  });

  test("GET /repos/{owner}/{repo} should return repository contract", async ({ request }) => {
    // Test purpose:
    // Verify that a public repository used by the profile content is still reachable.
    const response = await request.get(`${githubBaseUrl}/repos/${githubUser}/${githubRepo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    // Avoid checking volatile values such as stars, forks, timestamps, or descriptions.
    expect(body.full_name).toBe(`${githubUser}/${githubRepo}`);
    expect(body.private).toBe(false);
    expect(body).toHaveProperty("html_url");
  });

  test("GET /repos/{owner}/not-existing-repo should return external error contract", async ({ request }) => {
    // Test purpose:
    // Verify that the 3rd-party API returns a predictable error contract for a missing resource.
    const response = await request.get(`${githubBaseUrl}/repos/${githubUser}/not-existing-repo-for-api-test`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("application/json");

    // GitHub returns a message field for many error cases; do not assert the full response body.
    expect(body).toHaveProperty("message");
    expect(body.message).toContain("Not Found");
  });
});
