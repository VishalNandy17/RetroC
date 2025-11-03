import { scanWorkspaceSecurity, scanCurrentFileSecurity } from '../security/scanner';
import { applyReentrancyFixForCurrentFile } from '../security/autofix';
import { fixLowLevelCallsInCurrentFile } from '../security/lowLevelCallFix';
import { showSecurityReportWorkspace, showSecurityReportCurrent } from '../security/report';

export async function scanSecurityWorkspace() { await scanWorkspaceSecurity(); }
export async function scanSecurityCurrent() { await scanCurrentFileSecurity(); }
export async function fixReentrancyCurrent() { await applyReentrancyFixForCurrentFile(); }
export async function fixLowLevelCallCurrent() { await fixLowLevelCallsInCurrentFile(); }
export async function securityReportWorkspace() { await showSecurityReportWorkspace(); }
export async function securityReportCurrent() { await showSecurityReportCurrent(); }


