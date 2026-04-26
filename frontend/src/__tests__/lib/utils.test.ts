/**
 * Unit tests for src/lib/utils.ts
 * Tests: cn, formatDate, formatRelativeDate, formatCurrency,
 *        slugify, truncate, getYouTubeVideoId, getYouTubeThumbnail,
 *        getYouTubeEmbedUrl, capitalize, titleCase, isValidEmail, isValidPhone
 */

// ─── Mock date-fns so tests don't depend on the current date ─────────────────
jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  formatDistanceToNow: jest.fn(() => "2 days ago"),
}));

import {
  cn,
  formatDate,
  formatRelativeDate,
  formatCurrency,
  slugify,
  truncate,
  getYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
  capitalize,
  titleCase,
  isValidEmail,
  isValidPhone,
} from "@/lib/utils";

// ─── cn (class name merger) ───────────────────────────────────────────────────
describe("cn()", () => {
  it("merges simple class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    // tailwind-merge should keep the last conflicting utility
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("handles undefined / null / false gracefully", () => {
    expect(cn("a", undefined, null as any, false, "b")).toBe("a b");
  });

  it("handles conditional object syntax", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe("text-red-500");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────
describe("formatDate()", () => {
  it("formats an ISO date string with the default pattern", () => {
    expect(formatDate("2024-01-15")).toBe("15 January 2024");
  });

  it("accepts a custom pattern", () => {
    expect(formatDate("2024-01-15", "yyyy/MM/dd")).toBe("2024/01/15");
  });

  it("returns the original string when date is invalid", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("handles full ISO timestamp", () => {
    expect(formatDate("2024-06-20T10:30:00.000Z", "dd MMM yyyy")).toBe("20 Jun 2024");
  });
});

// ─── formatRelativeDate ───────────────────────────────────────────────────────
describe("formatRelativeDate()", () => {
  it("returns a human-readable relative time string", () => {
    expect(formatRelativeDate("2024-01-01")).toBe("2 days ago"); // mocked above
  });

  it("returns the original string when date is invalid", () => {
    expect(formatRelativeDate("bad-date")).toBe("bad-date");
  });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────
describe("formatCurrency()", () => {
  it("formats a number as Indian Rupees", () => {
    const result = formatCurrency(1000);
    expect(result).toContain("1,000");
    expect(result).toMatch(/₹|INR/);
  });

  it("does not include decimal places for whole numbers", () => {
    const result = formatCurrency(501);
    expect(result).not.toContain(".");
  });

  it("formats large amounts with Indian grouping", () => {
    const result = formatCurrency(100000);
    expect(result).toContain("1,00,000");
  });

  it("supports alternate currency code", () => {
    const result = formatCurrency(100, "USD");
    expect(result).toMatch(/\$|USD/);
  });
});

// ─── slugify ─────────────────────────────────────────────────────────────────
describe("slugify()", () => {
  it("converts spaces to hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Poojas & Sevas!")).toBe("poojas-sevas");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a---b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  test  ")).toBe("test");
  });

  it("handles temple name", () => {
    expect(slugify("Sri Venkata Sai")).toBe("sri-venkata-sai");
  });
});

// ─── truncate ────────────────────────────────────────────────────────────────
describe("truncate()", () => {
  it("returns the original text if shorter than maxLength", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("returns the original text if equal to maxLength", () => {
    const text = "exact";
    expect(truncate(text, text.length)).toBe(text);
  });

  it("truncates and appends ellipsis when text is longer than maxLength", () => {
    const result = truncate("Hello World", 5);
    expect(result).toBe("Hello…");
  });

  it("trims trailing spaces before appending ellipsis", () => {
    const result = truncate("Hello   ", 6); // "Hello " trimmed to "Hello"
    expect(result).toBe("Hello…");
  });
});

// ─── getYouTubeVideoId ───────────────────────────────────────────────────────
describe("getYouTubeVideoId()", () => {
  const videoId = "dQw4w9WgXcQ";

  it("extracts ID from standard youtube.com/watch URL", () => {
    expect(getYouTubeVideoId(`https://www.youtube.com/watch?v=${videoId}`)).toBe(videoId);
  });

  it("extracts ID from youtu.be short URL", () => {
    expect(getYouTubeVideoId(`https://youtu.be/${videoId}`)).toBe(videoId);
  });

  it("extracts ID from embed URL", () => {
    expect(getYouTubeVideoId(`https://www.youtube.com/embed/${videoId}`)).toBe(videoId);
  });

  it("extracts ID from Shorts URL", () => {
    expect(getYouTubeVideoId(`https://www.youtube.com/shorts/${videoId}`)).toBe(videoId);
  });

  it("returns null for non-YouTube URLs", () => {
    expect(getYouTubeVideoId("https://vimeo.com/123456")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getYouTubeVideoId("")).toBeNull();
  });
});

// ─── getYouTubeThumbnail ─────────────────────────────────────────────────────
describe("getYouTubeThumbnail()", () => {
  it("returns a maxresdefault thumbnail URL for a valid YouTube URL", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    expect(getYouTubeThumbnail(url)).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    );
  });

  it("returns placeholder for invalid URL", () => {
    expect(getYouTubeThumbnail("https://vimeo.com/123")).toBe(
      "/images/video-placeholder.jpg"
    );
  });
});

// ─── getYouTubeEmbedUrl ──────────────────────────────────────────────────────
describe("getYouTubeEmbedUrl()", () => {
  it("returns a valid embed URL", () => {
    const url = "https://youtu.be/dQw4w9WgXcQ";
    expect(getYouTubeEmbedUrl(url)).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
    );
  });

  it("returns empty string for invalid URL", () => {
    expect(getYouTubeEmbedUrl("not-a-url")).toBe("");
  });
});

// ─── capitalize ──────────────────────────────────────────────────────────────
describe("capitalize()", () => {
  it("capitalises first letter and lowercases the rest", () => {
    expect(capitalize("hELLO")).toBe("Hello");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });
});

// ─── titleCase ───────────────────────────────────────────────────────────────
describe("titleCase()", () => {
  it("title-cases each word", () => {
    expect(titleCase("Sri Venkata Sai Devasthanam")).toBe("Sri Venkata Sai Devasthanam");
  });

  it("lowercases capitalised input words", () => {
    expect(titleCase("DONATION FORM")).toBe("Donation Form");
  });
});

// ─── isValidEmail ─────────────────────────────────────────────────────────────
describe("isValidEmail()", () => {
  it.each([
    "user@example.com",
    "admin@srivenkatasai.org",
    "test.user+filter@domain.co.in",
  ])("returns true for valid email: %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(["not-an-email", "@missing-local.com", "missing-at-sign", "a@b"])(
    "returns false for invalid email: %s",
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    }
  );
});

// ─── isValidPhone ─────────────────────────────────────────────────────────────
describe("isValidPhone()", () => {
  it.each(["+919876543210", "9876543210"])(
    "returns true for valid phone: %s",
    (phone) => {
      expect(isValidPhone(phone)).toBe(true);
    }
  );

  it.each(["12345", "not-a-phone", ""])(
    "returns false for invalid phone: %s",
    (phone) => {
      expect(isValidPhone(phone)).toBe(false);
    }
  );
});
