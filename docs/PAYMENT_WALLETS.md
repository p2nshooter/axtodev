# Crypto Payment Wallets

AXTO.dev accepts crypto payments by generating a per-order quote (live fiat
→ crypto rate from CoinGecko, valid for 20 minutes) and asking the customer
to send the exact amount to a fixed receiving address for that asset. This
is intentionally simple (no custodial exchange integration, no private keys
touch the server) — the tradeoff is that **payment confirmation is manual**
(admin marks an order paid after verifying the on-chain transaction) unless
you later wire up a chain-monitoring webhook (see "Automating confirmation"
below).

## ⚠️ Before going live — verify every address yourself

The addresses below were transcribed from deposit-address screenshots you
provided. Crypto transfers are irreversible: a single mistyped character
sends funds somewhere unrecoverable. **Do not trust this file as the source
of truth.** Before setting these as environment variables in production:

1. Open your exchange/wallet app yourself and copy each address directly
   (or re-scan the QR code with a phone).
2. Paste it into the corresponding `CRYPTO_ADDRESS_*` GitHub Secret /
   Cloudflare Pages environment variable.
3. Send a small test transaction the first time you enable each asset in
   production and confirm it arrives before advertising it to customers.

| Asset | Network | Address (as transcribed — **re-verify before use**) |
|---|---|---|
| BTC | Bitcoin | `1AzqohLY6XPGbabHmMhstYMPFUThoiBnya` |
| ETH | Ethereum | `0x1bed722b27b3d2bdab3dfe06ea75b84a3a824f3d` |
| BNB | BNB Smart Chain (BEP20) | `0x1bed722b27b3d2bdab3dfe06ea75b84a3a824f3d` |
| SOL | Solana | `CUnEGFRZvMu8xieLdiM9oHXa5dzS9xJVvNnEiyXRaogD` |
| USDT | Tron (TRC20) | `TNo8jgJqmnUGAPUDb159cC8uhAeFDP8keW` |
| DOGE | Dogecoin | `DJUK77iDsus6URWcwNZnsqAyESUr426Df3` |

The app itself never hardcodes these — it reads `CRYPTO_ADDRESS_BTC`,
`CRYPTO_ADDRESS_ETH`, `CRYPTO_ADDRESS_BNB`, `CRYPTO_ADDRESS_SOL`,
`CRYPTO_ADDRESS_USDT_TRC20`, and `CRYPTO_ADDRESS_DOGE` from the environment
(`src/lib/crypto-payment.ts`). An asset is only offered at checkout if its
address is configured **and** passes format validation
(`src/lib/wallet-address.ts`):

- BTC — base58, starts with `1`, `3`, or `bc1`, length 25–62.
- ETH / BNB — `0x` + 40 hex chars; if the address is mixed-case it must
  match EIP-55 checksum casing, which catches most single-character typos.
- SOL — base58, 32–44 chars.
- USDT (TRC20) — starts with `T`, 34 chars, base58.
- DOGE — base58, starts with `D`, 34 chars.

If validation fails, that payment method is hidden from checkout instead of
silently accepting payments to a broken address.

## How a crypto order works

1. Customer selects "Pay with Crypto" at checkout and picks an asset.
2. `POST /api/checkout/crypto` creates a `Payment` row with status
   `PENDING`, fetches the live USD price from CoinGecko, computes the exact
   coin amount for the order total, and locks the quote for 20 minutes
   (`expiresAt`).
3. The customer is shown the receiving address, a QR code, the exact
   amount, and a countdown.
4. The customer (or, once wired up, an on-chain monitor) reports the
   transaction hash. Until then, an admin reviews pending crypto payments
   in `/admin/orders` and confirms them after checking a block explorer.
5. On confirmation, `markOrderPaid()` runs — the same code path used by the
   PayPal webhook — which grants library access, issues signed download
   tokens, and sends the receipt email.

## Automating confirmation (future work)

The architecture keeps this pluggable: `src/lib/crypto-payment.ts` exposes
`confirmCryptoPayment(paymentId, txHash)` independent of how it's triggered.
To automate it, add a chain-watcher (e.g. a Cloudflare Cron Trigger that
polls a block-explorer API per asset) that calls this function when a
matching on-chain transfer is found — no core checkout code needs to change.
