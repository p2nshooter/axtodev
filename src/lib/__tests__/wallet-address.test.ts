import { describe, expect, it } from "vitest";
import { isValidWalletAddress } from "@/lib/wallet-address";

describe("isValidWalletAddress", () => {
  it("accepts a well-formed BTC address", () => {
    expect(isValidWalletAddress("BTC", "1AzqohLY6XPGbabHmMhstYMPFUThoiBnya")).toBe(true);
  });

  it("accepts a well-formed EVM address", () => {
    expect(isValidWalletAddress("ETH", "0x1bed722b27b3d2bdab3dfe06ea75b84a3a824f3d")).toBe(true);
  });

  it("rejects an EVM address with the wrong length", () => {
    expect(isValidWalletAddress("ETH", "0x1bed722b27b3d2bdab3dfe06ea75b84a3a824")).toBe(false);
  });

  it("accepts a well-formed TRC20 USDT address", () => {
    expect(isValidWalletAddress("USDT_TRC20", "TNo8jgJqmnUGAPUDb159cC8uhAeFDP8keW")).toBe(true);
  });

  it("rejects an empty address", () => {
    expect(isValidWalletAddress("SOL", "")).toBe(false);
  });

  it("rejects a DOGE address that doesn't start with D", () => {
    expect(isValidWalletAddress("DOGE", "1AzqohLY6XPGbabHmMhstYMPFUThoiBnya")).toBe(false);
  });
});
