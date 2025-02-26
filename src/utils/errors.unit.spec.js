import { StatusCodes } from 'http-status-codes';
import { appError } from './errors';
import { logger } from './logger';
import createError from 'http-errors';

jest.mock(`./logger`);
jest.mock(`http-errors`);

fdescribe('Utils > Error', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute logger.error', () => {
    const message = 'Error message';
    appError(message);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(message);
  });

  it('should execute createError with message and default status code', () => {
    const message = 'Error message';
    appError(message);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
      message,
    );
  });

  it('should execute createError with message and provided status code', () => {
    const message = 'Error message';
    appError(message, StatusCodes.UNPROCESSABLE_ENTITY);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.UNPROCESSABLE_ENTITY,
      message,
    );
  });
});
