import { describe, expect, it } from "vitest";

describe("List component maxRows filtering", () => {
  const itemsPerPageSizes = [10, 25, 50, 100];

  it("should filter sizes when maxRows is set", () => {
    const modelDefaultListSize = undefined;
    const modelMaxRows = 50;

    let sizes = modelDefaultListSize
      ? [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b)
      : itemsPerPageSizes;

    if (modelMaxRows) {
      sizes = sizes.filter((size) => size <= modelMaxRows);
    }

    expect(sizes).toEqual([10, 25, 50]);
    expect(sizes).not.toContain(100);
  });

  it("should not filter sizes when maxRows is not set", () => {
    const modelDefaultListSize = undefined;
    const modelMaxRows = undefined;

    let sizes = modelDefaultListSize
      ? [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b)
      : itemsPerPageSizes;

    if (modelMaxRows) {
      sizes = sizes.filter((size) => size <= modelMaxRows);
    }

    expect(sizes).toEqual([10, 25, 50, 100]);
  });

  it("should include defaultListSize and filter by maxRows", () => {
    const modelDefaultListSize = 75;
    const modelMaxRows = 50;

    let sizes = modelDefaultListSize
      ? [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b)
      : itemsPerPageSizes;

    if (modelMaxRows) {
      sizes = sizes.filter((size) => size <= modelMaxRows);
    }

    // 75 should be filtered out because it exceeds maxRows of 50
    expect(sizes).toEqual([10, 25, 50]);
    expect(sizes).not.toContain(75);
    expect(sizes).not.toContain(100);
  });

  it("should include defaultListSize when it is below maxRows", () => {
    const modelDefaultListSize = 30;
    const modelMaxRows = 50;

    let sizes = modelDefaultListSize
      ? [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b)
      : itemsPerPageSizes;

    if (modelMaxRows) {
      sizes = sizes.filter((size) => size <= modelMaxRows);
    }

    expect(sizes).toEqual([10, 25, 30, 50]);
    expect(sizes).not.toContain(100);
  });

  it("should handle maxRows equal to an existing size", () => {
    const modelDefaultListSize = undefined;
    const modelMaxRows = 25;

    let sizes = modelDefaultListSize
      ? [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b)
      : itemsPerPageSizes;

    if (modelMaxRows) {
      sizes = sizes.filter((size) => size <= modelMaxRows);
    }

    expect(sizes).toEqual([10, 25]);
  });

  it("should handle maxRows smaller than all default sizes", () => {
    const modelDefaultListSize = undefined;
    const modelMaxRows = 5;

    let sizes = modelDefaultListSize
      ? [...itemsPerPageSizes, modelDefaultListSize].sort((a, b) => a - b)
      : itemsPerPageSizes;

    if (modelMaxRows) {
      sizes = sizes.filter((size) => size <= modelMaxRows);
    }

    // All sizes should be filtered out since they all exceed maxRows
    expect(sizes).toEqual([]);
  });
});
