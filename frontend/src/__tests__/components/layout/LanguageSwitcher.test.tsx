/**
 * Unit tests for src/components/layout/LanguageSwitcher.tsx
 *
 * Note: window.location.reload is non-writable in jsdom 20+ and cannot be
 * spied upon without a custom test environment. We verify the locale cookie
 * is correctly set (the user-observable behaviour) rather than checking
 * whether the page reload was triggered (an internal implementation detail).
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

// -- next-intl mock ------------------------------------------------------------
let mockLocale = "en";

jest.mock("next-intl", () => ({
  useLocale: () => mockLocale,
}));

// -- lucide-react mock (Globe icon) --------------------------------------------
jest.mock("lucide-react", () => ({
  Globe: ({ className }: { className?: string }) => (
    <svg data-testid="globe-icon" className={className} />
  ),
}));

describe("LanguageSwitcher (full / non-compact)", () => {
  beforeEach(() => {
    mockLocale = "en";
    document.cookie = "";
  });

  it("renders the Globe icon", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
  });

  it("renders 3 language buttons", () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("highlights the current locale button", () => {
    mockLocale = "te";
    render(<LanguageSwitcher />);
    const teBtn = screen.getByRole("button", { name: /Telugu/i });
    expect(teBtn.className).toContain("border-saffron");
  });

  it("sets locale cookie on language click", () => {
    render(<LanguageSwitcher />);
    const hiBtn = screen.getByRole("button", { name: /Hindi/i });
    fireEvent.click(hiBtn);
    expect(document.cookie).toContain("locale=hi");
  });

  it("sets locale cookie even when same locale is clicked", () => {
    mockLocale = "en";
    render(<LanguageSwitcher />);
    const enBtn = screen.getByRole("button", { name: /English/i });
    fireEvent.click(enBtn);
    expect(document.cookie).toContain("locale=en");
  });

  it("language buttons each have accessible aria-label", () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-label");
    });
  });
});

describe("LanguageSwitcher (compact mode)", () => {
  beforeEach(() => {
    mockLocale = "en";
  });

  it("renders 3 compact locale-code buttons", () => {
    render(<LanguageSwitcher compact />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("compact buttons display uppercase locale codes", () => {
    render(<LanguageSwitcher compact />);
    const buttons = screen.getAllByRole("button");
    const texts = buttons.map((b) => b.textContent);
    expect(texts).toEqual(expect.arrayContaining(["EN", "TE", "HI"]));
  });

  it("highlights active locale in compact mode", () => {
    mockLocale = "hi";
    render(<LanguageSwitcher compact />);
    const hiBtn = screen.getByRole("button", { name: /Switch to Hindi/i });
    expect(hiBtn.className).toContain("text-golden");
  });

  it("sets cookie on compact button click", () => {
    render(<LanguageSwitcher compact />);
    const teBtn = screen.getByRole("button", { name: /Switch to Telugu/i });
    fireEvent.click(teBtn);
    expect(document.cookie).toContain("locale=te");
  });
});
