/**
 * @jest-environment node
 */
import {
  getDeities,
  getFestivals,
  getPoojas,
  getTimings,
  pickLocalized,
  toDeity,
  toFestival,
  toPooja,
  toTiming,
  REVALIDATE_SECONDS,
  type ApiDeity,
  type ApiFestival,
  type ApiPooja,
  type ApiTiming,
} from "@/lib/content";
import { DEITIES, FESTIVALS, POOJAS, TEMPLE_TIMINGS } from "@/lib/constants";

const API_URL = "https://api.example.test/api";

const apiDeity: ApiDeity = {
  id: "d1",
  slug: "sai-baba",
  nameEn: "Sai Baba",
  nameTe: "సాయి బాబా",
  nameHi: "साईं बाबा",
  descriptionEn: "Shirdi Sai Baba was a spiritual master.",
  shortDescriptionEn: "Universal Saint",
  significance: "Transcends religious boundaries.",
  rituals: ["Thursday special pooja", "Sai Satcharitra parayanam"],
  imageUrl: "/images/deities/sai-baba.jpg",
  orderIndex: 3,
};

const apiTiming: ApiTiming = {
  id: "t1",
  activity: "Morning Darshan",
  activityTe: "ఉదయం దర్శనం",
  startTime: "07:00 AM",
  endTime: "12:00 PM",
  dayType: "ALL",
  sortOrder: 3,
};

const apiPooja: ApiPooja = {
  id: "p1",
  nameEn: "Maha Archana",
  nameTe: null,
  descriptionEn: "Complete archana with 108 names",
  type: "DAILY",
  timeEn: "9:00 AM",
  notes: "Book in advance",
  cost: 116,
};

const apiFestival: ApiFestival = {
  id: "f1",
  slug: "ugadi",
  nameEn: "Ugadi",
  nameTe: "ఉగాది",
  descriptionEn: "Telugu New Year",
  month: "March / April",
  icon: "🌟",
  isHighlighted: false,
};

function mockFetchJson(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return jest.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  });
}

describe("lib/content", () => {
  const originalFetch = global.fetch;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    warnSpy.mockRestore();
  });

  describe("pickLocalized", () => {
    it("uses the Telugu or Hindi text when that language is selected", () => {
      expect(pickLocalized("te", "Ugadi", "ఉగాది", "उगादि")).toBe("ఉగాది");
      expect(pickLocalized("hi", "Ugadi", "ఉగాది", "उगादि")).toBe("उगादि");
    });

    it("falls back to English when the translation is missing", () => {
      expect(pickLocalized("te", "Navaratri", null)).toBe("Navaratri");
      expect(pickLocalized("hi", "Navaratri", "నవరాత్రి", "")).toBe("Navaratri");
    });

    it("uses English for English and for languages without DB columns (Tamil)", () => {
      expect(pickLocalized("en", "Ugadi", "ఉగాది", "उगादि")).toBe("Ugadi");
      expect(pickLocalized("ta", "Ugadi", "ఉగాది", "उगादि")).toBe("Ugadi");
    });
  });

  describe("mappers", () => {
    it("maps a deity, joining the rituals list into text", () => {
      expect(toDeity(apiDeity, "en")).toEqual({
        id: "d1",
        slug: "sai-baba",
        name: "Sai Baba",
        imageUrl: "/images/deities/sai-baba.jpg",
        shortDescription: "Universal Saint",
        description: "Shirdi Sai Baba was a spiritual master.",
        significance: "Transcends religious boundaries.",
        rituals: "Thursday special pooja, Sai Satcharitra parayanam",
        orderIndex: 3,
      });
      expect(toDeity(apiDeity, "te").name).toBe("సాయి బాబా");
    });

    it("uses empty strings for missing optional deity fields", () => {
      const minimal = toDeity({ ...apiDeity, shortDescriptionEn: null, significance: null, rituals: null, imageUrl: null }, "en");
      expect(minimal).toMatchObject({ shortDescription: "", significance: "", rituals: "", imageUrl: "" });
    });

    it("joins start and end time, and shows a single time when there is no end", () => {
      expect(toTiming(apiTiming, "en")).toEqual({
        id: "t1",
        activity: "Morning Darshan",
        time: "07:00 AM - 12:00 PM",
        dayType: "ALL",
        orderIndex: 3,
      });
      expect(toTiming({ ...apiTiming, endTime: null }, "en").time).toBe("07:00 AM");
      expect(toTiming(apiTiming, "te").activity).toBe("ఉదయం దర్శనం");
    });

    it("maps a pooja, dropping null notes and cost", () => {
      expect(toPooja(apiPooja, "te")).toEqual({
        id: "p1",
        name: "Maha Archana",
        description: "Complete archana with 108 names",
        time: "9:00 AM",
        notes: "Book in advance",
        type: "DAILY",
        cost: 116,
      });
      const free = toPooja({ ...apiPooja, cost: null, notes: null }, "en");
      expect(free.cost).toBeUndefined();
      expect(free.notes).toBeUndefined();
    });

    it("maps a festival and gives it a default icon", () => {
      expect(toFestival(apiFestival, "te")).toEqual({
        id: "f1",
        slug: "ugadi",
        name: "ఉగాది",
        month: "March / April",
        description: "Telugu New Year",
        icon: "🌟",
        highlight: false,
      });
      expect(toFestival({ ...apiFestival, icon: null, month: null }, "en")).toMatchObject({ icon: "🪔", month: "" });
    });
  });

  describe("loaders", () => {
    it("loads from the API with a 5-minute cache and a timeout", async () => {
      global.fetch = mockFetchJson([apiDeity]);

      const deities = await getDeities("te");

      expect(deities).toEqual([toDeity(apiDeity, "te")]);
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/deities`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: expect.any(AbortSignal),
      });
      expect(REVALIDATE_SECONDS).toBe(300);
    });

    it.each([
      ["getTimings", getTimings, "/timings", apiTiming, toTiming],
      ["getPoojas", getPoojas, "/poojas", apiPooja, toPooja],
      ["getFestivals", getFestivals, "/festivals", apiFestival, toFestival],
    ] as const)("%s maps API data", async (_name, loader, path, item, mapper) => {
      global.fetch = mockFetchJson([item]);

      const result = await (loader as (locale: string) => Promise<unknown[]>)("en");

      expect(result).toEqual([(mapper as (x: unknown, l: string) => unknown)(item, "en")]);
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(`${API_URL}${path}`);
    });

    describe("falls back to the static data", () => {
      it("when the API URL is not configured (no request is made)", async () => {
        delete process.env.NEXT_PUBLIC_API_URL;
        global.fetch = jest.fn();

        await expect(getDeities("en")).resolves.toBe(DEITIES);
        expect(global.fetch).not.toHaveBeenCalled();
      });

      it("when the API returns an error status", async () => {
        global.fetch = mockFetchJson({ message: "boom" }, { ok: false, status: 500 });

        await expect(getTimings("en")).resolves.toBe(TEMPLE_TIMINGS);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("/timings returned 500"));
      });

      it("when the API returns an empty list", async () => {
        global.fetch = mockFetchJson([]);
        await expect(getPoojas("en")).resolves.toBe(POOJAS);
      });

      it("when the API returns something that is not a list", async () => {
        global.fetch = mockFetchJson({ unexpected: true });
        await expect(getFestivals("en")).resolves.toBe(FESTIVALS);
      });

      it("when the request times out (e.g. Render waking up)", async () => {
        const timeout = Object.assign(new Error("The operation was aborted due to timeout"), { name: "TimeoutError" });
        global.fetch = jest.fn().mockRejectedValue(timeout);

        await expect(getDeities("en")).resolves.toBe(DEITIES);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("/deities unavailable (TimeoutError)"));
      });

      it("when the network request fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(new TypeError("fetch failed"));
        await expect(getFestivals("en")).resolves.toBe(FESTIVALS);
      });
    });
  });

  it("static festival fallback matches the database slugs", () => {
    expect(FESTIVALS.map((f) => f.slug)).toEqual([
      "brahmotsavam", "rama-navami", "hanuman-jayanti", "sai-baba-aradhana", "maha-shivaratri", "guru-purnima",
      "ganesh-chaturthi", "navaratri", "deepavali", "vaikunta-ekadashi", "ugadi", "karthika-masa",
    ]);
  });
});
