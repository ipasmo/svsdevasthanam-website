/**
 * Unit tests for src/components/ui/Button.tsx
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with default variant and size classes", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("rounded-full");
  });

  it("forwards additional HTML button props", () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const btn = screen.getByTestId("submit-btn");
    expect(btn).toHaveAttribute("type", "submit");
  });

  // ── Variants ───────────────────────────────────────────────────────────────
  it.each([
    ["primary", "bg-saffron"],
    ["secondary", "border-saffron"],
    ["ghost", "text-gray-600"],
    ["danger", "bg-red-500"],
    ["golden", "bg-golden"],
  ] as const)("variant '%s' renders with expected class '%s'", (variant, cls) => {
    render(<Button variant={variant}>Btn</Button>);
    expect(screen.getByRole("button").className).toContain(cls);
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────
  it.each([
    ["sm", "px-4"],
    ["md", "px-6"],
    ["lg", "px-8"],
  ] as const)("size '%s' renders with expected class '%s'", (size, cls) => {
    render(<Button size={size}>Btn</Button>);
    expect(screen.getByRole("button").className).toContain(cls);
  });

  // ── Disabled state ─────────────────────────────────────────────────────────
  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ── Loading state ──────────────────────────────────────────────────────────
  it("shows Loader2 spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    // Loader2 renders as svg; button should still be disabled
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // SVG spinner should be present
    expect(btn.querySelector("svg")).not.toBeNull();
  });

  it("hides leftIcon when isLoading is true", () => {
    render(
      <Button isLoading leftIcon={<span data-testid="icon">IC</span>}>
        Loading
      </Button>
    );
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("hides rightIcon when isLoading is true", () => {
    render(
      <Button isLoading rightIcon={<span data-testid="right-icon">→</span>}>
        Loading
      </Button>
    );
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
  });

  // ── Icons when NOT loading ─────────────────────────────────────────────────
  it("renders leftIcon when not loading", () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">←</span>}>With Icon</Button>
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon when not loading", () => {
    render(
      <Button rightIcon={<span data-testid="right-icon">→</span>}>With Icon</Button>
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  // ── Click handler ──────────────────────────────────────────────────────────
  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // ── Custom className ───────────────────────────────────────────────────────
  it("applies custom className alongside built-in classes", () => {
    render(<Button className="custom-class">Styled</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("custom-class");
    expect(btn.className).toContain("rounded-full");
  });
});
