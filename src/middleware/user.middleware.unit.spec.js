const { appError } = require('@/utils');
const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const { get } = require('./user.middleware');
import * as service from '@/database/service';
import { buildError, buildNext, buildReq } from 'test/builders';

jest.mock('@/database/service');

describe('Middleware > User', () => {
  const error = buildError(
    StatusCodes.UNPROCESSABLE_ENTITY,
    `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
  );

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should forward an error when an email is NOT provided in the headers', () => {
    const req = buildReq({
      headers: {},
    });
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should forward an error when an email is provided in the headers but is invalid', () => {
    const req = buildReq({ headers: { email: 'otavio @gmail.com' } });
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid email is provided', async () => {
    // arrange
    const req = buildReq();
    const next = buildNext();
    const resolved = {
      id: 1,
      email: req.headers.email,
    };

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([resolved]);

    // act
    await get(req, null, next);

    // assert
    expect(req.user).toBeDefined();
    expect(req.user).toEqual(resolved);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/*nothing*/);
  });

  it('should forward an error when service.findOrSave fails', async () => {
    const req = buildReq();
    const next = buildNext();

    delete req.user;

    const errorMessage = 'Um erro qualquer';

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce(errorMessage);

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
