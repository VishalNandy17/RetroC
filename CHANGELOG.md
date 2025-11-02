# Changelog

All notable changes to this project will be documented in this file.

## 1.0.5 - 2025-11-02
### Added
- Comprehensive input validation for all user inputs (filenames, addresses, identifiers)
- Path traversal protection in file generation
- Error handling with try-catch blocks and user-friendly messages
- Security improvements in templates:
  - Reentrancy guards for multisig, staking, and vesting contracts
  - SafeERC20 usage in staking and vesting contracts
  - Address validation in all constructors
  - Enhanced modifiers and validation in multisig contract
- ERC-2981 royalty support in ERC721 template
- EIP-2612 permit support in ERC20 template
- ERC20Burnable support in ERC20 template
- Additional test coverage for validators and file operations
- ESLint dependencies (@typescript-eslint/eslint-plugin, @typescript-eslint/parser)

### Fixed
- Security vulnerabilities in multisig contract (reentrancy, missing validation)
- Security issues in staking contract (missing SafeERC20, reentrancy)
- Security issues in vesting contract (input validation, reentrancy)
- Path traversal vulnerabilities in file writing
- Missing error handling in command functions

### Changed
- Enhanced ERC721 template with royalty support and Counters library
- Improved vesting contract with better validation and edge case handling
- Updated all command functions to include comprehensive validation
- Improved error messages throughout the extension

## 1.0.4 - 2025-10-30
- Version bump for package updates

## 1.0.0 - 2025-10-28
- Initial release of RetroC VS Code extension
- ERC20/721/1155, DAO, Multisig, Staking, Vesting templates
- Test generation (Hardhat/Foundry)
- Configurable settings and keybindings

