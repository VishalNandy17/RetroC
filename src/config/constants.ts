export const COMMANDS = {
  ERC20: 'retroc.generateERC20',
  ERC721: 'retroc.generateERC721',
  ERC1155: 'retroc.generateERC1155',
  DAO: 'retroc.generateDAO',
  MULTISIG: 'retroc.generateMultisig',
  STAKING: 'retroc.generateStaking',
  VESTING: 'retroc.generateVesting',
  TEST: 'retroc.generateTests',
  TEST_ALL: 'retroc.generateAllTests',
  SETTINGS: 'retroc.openSettings',
} as const;

export const TEMPLATE_PATHS = {
  ERC20: 'tokens/erc20',
  ERC721: 'tokens/erc721',
  ERC1155: 'tokens/erc1155',
  DAO: 'governance/dao',
  MULTISIG: 'governance/multisig',
  STAKING: 'defi/staking',
  VESTING: 'defi/vesting',
} as const;


