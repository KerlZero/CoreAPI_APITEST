import { test, expect } from '@playwright/test';

test.describe('ReqRes API Automation Practice', () => {
  test('GET user by valid id should return user data', async ({ request }) => {
    const response = await request.get('/api/users/2');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data.id).toBe(2);
    expect(body.data.email).toBeTruthy();
    expect(body.data.email).toContain('@reqres.in');
    expect(body.data.first_name).toBeTruthy();
    expect(body.data.last_name).toBeTruthy();
  });

  test('GET user by invalid id should return 404', async ({ request }) => {
    const response = await request.get('/api/users/999');

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body).toEqual({});
  });

  test('POST create user should return created user data', async ({ request }) => {
    const payload = {
      name: 'Dream',
      job: 'Software QA',
    };

    const response = await request.post('/api/users', {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
  });

  test('POST login success should return token', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.token).toBeTruthy();
  });

  test('POST login without password should return error', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: {
        email: 'peter@klaven',
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBeTruthy();
  });
});