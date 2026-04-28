const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  projects: [
     {
       name: 'internal-api',
       testMatch: /.*internal.*\.spec\.(js|ts)/,
    //   use: {
    //     baseURL: process.env.INTERNAL_BASE_URL,
    //     extraHTTPHeaders: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //       // ใส่ internal token/header ตรงนี้ในอนาคต ถ้ามี
    //     },
    //   },
     },

    {
      name: 'external-api',
      testMatch: /.*external.*\.spec\.(js|ts)/,
      use: {
        baseURL: process.env.REQRES_BASE_URL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': process.env.REQRES_API_KEY || '',
        },
      },
    },
  ],
});
