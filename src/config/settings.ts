import * as vscode from 'vscode';

export interface RetroCSettings {
  defaultSolidityVersion: string;
  defaultLicense: string;
  openZeppelinVersion: string;
  autoGenerateTests: boolean;
  testFramework: 'hardhat' | 'foundry';
  useTypeScript: boolean;
  contractsDirectory: string;
  testsDirectory: string;
  scriptsDirectory: string;
  indentSize: number;
  useSpaces: boolean;
  addComments: boolean;
  importStyle: 'named' | 'default';
  includeReentrancyGuard: boolean;
  includePausable: boolean;
  includeAccessControl: boolean;
  enableGasOptimizations: boolean;
  includeNatSpec: boolean;
  deploymentScripts: boolean;
  generateReadme: boolean;
}

export function getDefaultSettings(): RetroCSettings {
  const cfg = vscode.workspace.getConfiguration('retroc');
  return {
    defaultSolidityVersion: cfg.get('defaultSolidityVersion', '0.8.20'),
    defaultLicense: cfg.get('defaultLicense', 'MIT'),
    openZeppelinVersion: cfg.get('openZeppelinVersion', '5.0.0'),
    autoGenerateTests: cfg.get('autoGenerateTests', true),
    testFramework: cfg.get('testFramework', 'hardhat'),
    useTypeScript: cfg.get('useTypeScript', true),
    contractsDirectory: cfg.get('contractsDirectory', 'contracts'),
    testsDirectory: cfg.get('testsDirectory', 'test'),
    scriptsDirectory: cfg.get('scriptsDirectory', 'scripts'),
    indentSize: cfg.get('indentSize', 4),
    useSpaces: cfg.get('useSpaces', true),
    addComments: cfg.get('addComments', true),
    importStyle: cfg.get('importStyle', 'named'),
    includeReentrancyGuard: cfg.get('includeReentrancyGuard', true),
    includePausable: cfg.get('includePausable', true),
    includeAccessControl: cfg.get('includeAccessControl', true),
    enableGasOptimizations: cfg.get('enableGasOptimizations', true),
    includeNatSpec: cfg.get('includeNatSpec', true),
    deploymentScripts: cfg.get('deploymentScripts', true),
    generateReadme: cfg.get('generateReadme', true),
  };
}


