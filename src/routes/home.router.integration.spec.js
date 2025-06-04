const { buildCall } = require('test/builders.integration');

describe('Router > Integration > Home', () => {
  it('should return status 200 and a welcome message', async () => {
    const res = await buildCall('/api');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ welcome: 'Welcome Stranger!' });
  });
});
