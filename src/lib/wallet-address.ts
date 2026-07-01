import type { CryptoAsset } from "@/lib/constants";

// Format validation for receiving wallet addresses. This is a defense
// layer, not a guarantee of correctness — see docs/PAYMENT_WALLETS.md for
// the mandatory manual re-verification checklist every address must pass
// before a production launch. An address that fails validation is treated
// as "not configured" and hidden from checkout rather than trusted blindly.
//
// Note: EVM addresses are checked for shape (0x + 40 hex chars) only. Full
// EIP-55 checksum verification is intentionally not implemented here to
// avoid shipping an unaudited hand-rolled Keccak-256 — operators must
// still manually verify the address per docs/PAYMENT_WALLETS.md.

const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]+$/;

function isEvmAddressShape(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function isValidWalletAddress(asset: CryptoAsset, address: string): boolean {
  const trimmed = address.trim();
  if (!trimmed) return false;

  switch (asset) {
    case "BTC":
      return (
        /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed) ||
        /^bc1[a-z0-9]{25,62}$/.test(trimmed)
      );
    case "ETH":
    case "BNB":
      return isEvmAddressShape(trimmed);
    case "SOL":
      return trimmed.length >= 32 && trimmed.length <= 44 && BASE58_RE.test(trimmed);
    case "USDT_TRC20":
      return trimmed.length === 34 && trimmed.startsWith("T") && BASE58_RE.test(trimmed);
    case "DOGE":
      return trimmed.length === 34 && trimmed.startsWith("D") && BASE58_RE.test(trimmed);
    default:
      return false;
  }
}

export function maskAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}
