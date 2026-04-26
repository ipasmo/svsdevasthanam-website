/**
 * Unit tests for src/components/ui/SectionHeader.tsx
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/ui/SectionHeader";

describe("SectionHeader", () => {
  // ── Basic rendering ────────────────────────────────────────────────────────
  it("renders the title", () => {
    render(<SectionHeader title="About the Temple" />);
    expect(screen.getByRole("heading", { level: 2, name: "About the Temple" })).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<SectionHeader title="Events" subtitle="Upcoming poojas and festivals" />);
    expect(screen.getByText("Upcoming poojas and festivals")).toBeInTheDocument();
  });

  it("does not render subtitle paragraph when not provided", () => {
    render(<SectionHeader title="Events" />);
    // Only heading + h-1 divider should be present — no extra <p>
    const container = screen.getByRole("heading").parentElement!;
    expect(container.querySelector("p")).toBeNull();
  });

  // ── Alignment ─────────────────────────────────────────────────────────────
  it("defaults to center alignment", () => {
    render(<SectionHeader title="Centered" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    expect(wrapper.className).toContain("text-center");
    expect(wrapper.className).toContain("items-center");
  });

  it("applies left alignment classes", () => {
    render(<SectionHeader title="Left" align="left" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    expect(wrapper.className).toContain("text-left");
    expect(wrapper.className).toContain("items-start");
  });

  it("applies right alignment classes", () => {
    render(<SectionHeader title="Right" align="right" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    expect(wrapper.className).toContain("text-right");
    expect(wrapper.className).toContain("items-end");
  });

  // ── Light mode ────────────────────────────────────────────────────────────
  it("applies text-white to heading in light mode", () => {
    render(<SectionHeader title="Light Title" light />);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-white");
  });

  it("applies text-rust to heading by default (not light)", () => {
    render(<SectionHeader title="Dark Title" />);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-rust");
  });

  it("applies light subtitle colour", () => {
    render(<SectionHeader title="T" subtitle="Sub" light />);
    const subtitle = screen.getByText("Sub");
    expect(subtitle.className).toContain("text-white");
  });

  it("applies dark subtitle colour by default", () => {
    render(<SectionHeader title="T" subtitle="Sub" />);
    const subtitle = screen.getByText("Sub");
    expect(subtitle.className).toContain("text-gray-500");
  });

  // ── Custom className ───────────────────────────────────────────────────────
  it("applies custom className to the wrapper", () => {
    render(<SectionHeader title="Custom" className="my-section" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    expect(wrapper.className).toContain("my-section");
  });

  // ── Custom titleClassName ──────────────────────────────────────────────────
  it("applies titleClassName to the heading", () => {
    render(<SectionHeader title="Styled Title" titleClassName="title-override" />);
    expect(screen.getByRole("heading").className).toContain("title-override");
  });

  // ── Golden divider bar ────────────────────────────────────────────────────
  it("renders the golden divider bar", () => {
    render(<SectionHeader title="With Bar" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    const divider = wrapper.querySelectorAll("div");
    const bar = Array.from(divider).find((d) => d.className.includes("bg-golden"));
    expect(bar).toBeDefined();
  });

  it("centers the divider bar when align is center", () => {
    render(<SectionHeader title="Center" align="center" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    const bar = Array.from(wrapper.querySelectorAll("div")).find((d) =>
      d.className.includes("bg-golden")
    );
    expect(bar?.className).toContain("mx-auto");
  });

  it("right-aligns the divider bar when align is right", () => {
    render(<SectionHeader title="Right" align="right" />);
    const wrapper = screen.getByRole("heading").parentElement!;
    const bar = Array.from(wrapper.querySelectorAll("div")).find((d) =>
      d.className.includes("bg-golden")
    );
    expect(bar?.className).toContain("ml-auto");
  });
});
