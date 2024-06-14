import { describe, expect, it } from "vitest";
import { UUID } from "./uuid.js";

describe(UUID.typeName, () => {
  describe(".generate()", () => {
    it("returns a new UUID v4", () => {
      const generatedOne = UUID.generate();

      expect(UUID.generate()).not.toStrictEqual(generatedOne);
    });
  });
});
