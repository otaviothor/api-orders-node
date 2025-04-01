const { appError } = require('@/utils');
const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const { get } = require('./user.middleware');
import * as service from '@/database/service';

jest.mock('@/database/service');

describe('Middleware > User', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should forward an error when an email is NOT provided in the headers', () => {
    const req = { headers: {} };
    const next = jest.fn().mockName('next');
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should forward an error when an email is provided in the headers but is invalid', () => {
    const req = { headers: { email: 'otavio @gmail.com' } };
    const next = jest.fn().mockName('next');
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid email is provided', async () => {
    const email = 'otavio@gmail.com';
    const req = { headers: { email } };
    const next = jest.fn().mockName('next');

    const response = {
      id: 1,
      email,
    };

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([response]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual(response);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/*nothing*/);
  });

  it('should forward an error when service.findOrSave fails', async () => {
    const email = 'otavio@gmail.com';
    const req = { headers: { email } };
    const next = jest.fn().mockName('next');

    const errorMessage = 'Um erro qualquer';

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce(errorMessage);

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
