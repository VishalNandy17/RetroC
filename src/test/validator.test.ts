import * as assert from 'assert';
import { isValidFileName, sanitizeFileName, isValidEthereumAddress, isValidSolidityIdentifier, isPositiveIntegerString } from '../utils/validator';

describe('Validator', () => {
  describe('isValidFileName', () => {
    it('accepts valid filenames', () => {
      assert.strictEqual(isValidFileName('MyToken.sol'), true);
      assert.strictEqual(isValidFileName('test123.sol'), true);
      assert.strictEqual(isValidFileName('_underscore.sol'), true);
    });

    it('rejects path traversal attempts', () => {
      assert.strictEqual(isValidFileName('../token.sol'), false);
      assert.strictEqual(isValidFileName('../../token.sol'), false);
      assert.strictEqual(isValidFileName('token/../bad.sol'), false);
    });

    it('rejects invalid characters', () => {
      assert.strictEqual(isValidFileName('token<bad>.sol'), false);
      assert.strictEqual(isValidFileName('token:bad.sol'), false);
      assert.strictEqual(isValidFileName('token|bad.sol'), false);
    });

    it('rejects reserved Windows names', () => {
      assert.strictEqual(isValidFileName('CON.sol'), false);
      assert.strictEqual(isValidFileName('PRN.sol'), false);
    });
  });

  describe('sanitizeFileName', () => {
    it('sanitizes invalid characters', () => {
      assert.strictEqual(sanitizeFileName('token<>bad.sol'), 'token__bad.sol');
      assert.strictEqual(sanitizeFileName('../token.sol'), '_token.sol');
    });

    it('returns fallback for empty string', () => {
      assert.strictEqual(sanitizeFileName(''), 'Untitled');
    });
  });

  describe('isValidEthereumAddress', () => {
    it('accepts valid addresses', () => {
      assert.strictEqual(isValidEthereumAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'), true);
      assert.strictEqual(isValidEthereumAddress('0x0000000000000000000000000000000000000000'), true);
    });

    it('rejects invalid addresses', () => {
      assert.strictEqual(isValidEthereumAddress('0x123'), false);
      assert.strictEqual(isValidEthereumAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb'), false);
      assert.strictEqual(isValidEthereumAddress('invalid'), false);
    });
  });

  describe('isValidSolidityIdentifier', () => {
    it('accepts valid identifiers', () => {
      assert.strictEqual(isValidSolidityIdentifier('MyToken'), true);
      assert.strictEqual(isValidSolidityIdentifier('_token'), true);
      assert.strictEqual(isValidSolidityIdentifier('token123'), true);
    });

    it('rejects invalid identifiers', () => {
      assert.strictEqual(isValidSolidityIdentifier('123token'), false);
      assert.strictEqual(isValidSolidityIdentifier('token-name'), false);
      assert.strictEqual(isValidSolidityIdentifier('token name'), false);
      assert.strictEqual(isValidSolidityIdentifier(''), false);
    });
  });

  describe('isPositiveIntegerString', () => {
    it('accepts positive integers', () => {
      assert.strictEqual(isPositiveIntegerString('1'), true);
      assert.strictEqual(isPositiveIntegerString('1000000'), true);
    });

    it('rejects non-integers', () => {
      assert.strictEqual(isPositiveIntegerString('0'), false);
      assert.strictEqual(isPositiveIntegerString('-1'), false);
      assert.strictEqual(isPositiveIntegerString('abc'), false);
      assert.strictEqual(isPositiveIntegerString('1.5'), false);
    });
  });
});


