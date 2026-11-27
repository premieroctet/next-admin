import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Cell from "./Cell";
import { ConfigProvider } from "../context/ConfigContext";
import { ListDataFieldValue } from "../types";

const mockConfigValue = {
  basePath: "/admin",
  apiBasePath: "/api/admin",
  isAppDir: true,
  options: {},
  nextAdminContext: { locale: "en" },
};

const CellWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider value={mockConfigValue}>{children}</ConfigProvider>
);

describe("Cell component", () => {
  describe("boolean values", () => {
    it("should render default boolean formatting for true", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: "true",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toBe("true");
    });

    it("should render default boolean formatting for false", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: false,
        __nextadmin_formatted: "false",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toBe("false");
    });

    it("should render string formatter result for boolean", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: "Yes",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toBe("Yes");
    });

    it("should render ReactNode formatter result for boolean", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: <div data-testid="custom-format">Custom</div>,
      };

      render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      const element = screen.getByTestId("custom-format");
      expect(element).toBeDefined();
      expect(element.textContent).toBe("Custom");
    });

    it("should render complex ReactNode formatter for boolean", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: false,
        __nextadmin_formatted: (
          <strong data-testid="bool-strong">Unpublished</strong>
        ),
      };

      render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      const element = screen.getByTestId("bool-strong");
      expect(element).toBeDefined();
      expect(element.tagName).toBe("STRONG");
      expect(element.textContent).toBe("Unpublished");
    });

    it("should call formatter function for boolean and render ReactNode result", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: "true",
      };

      const formatter = vi.fn((value: boolean) => (
        <span data-testid="formatted-bool">Published</span>
      ));

      render(
        <CellWrapper>
          <Cell
            cell={cell}
            formatter={formatter}
            getRawData={() => true}
          />
        </CellWrapper>
      );

      expect(formatter).toHaveBeenCalled();
      const element = screen.getByTestId("formatted-bool");
      expect(element).toBeDefined();
      expect(element.textContent).toBe("Published");
    });

    it("should call formatter function for boolean false and render result", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: false,
        __nextadmin_formatted: "false",
      };

      const formatter = vi.fn((value: boolean) => (
        <strong data-testid="unpublished">Not Published</strong>
      ));

      render(
        <CellWrapper>
          <Cell
            cell={cell}
            formatter={formatter}
            getRawData={() => false}
          />
        </CellWrapper>
      );

      expect(formatter).toHaveBeenCalled();
      const element = screen.getByTestId("unpublished");
      expect(element).toBeDefined();
      expect(element.textContent).toBe("Not Published");
    });

    it("should call formatter function that returns string for boolean", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: "true",
      };

      const formatter = vi.fn((value: boolean) => (value ? "Yes" : "No"));

      const { container } = render(
        <CellWrapper>
          <Cell
            cell={cell}
            formatter={formatter}
            getRawData={() => true}
          />
        </CellWrapper>
      );

      expect(formatter).toHaveBeenCalled();
      expect(container.textContent).toBe("Yes");
    });
  });

  describe("other scalar types", () => {
    it("should render string values", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: "test string",
        __nextadmin_formatted: "test string",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toBe("test string");
    });

    it("should render number values", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: 42,
        __nextadmin_formatted: "42",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toBe("42");
    });
  });

  describe("count type", () => {
    it("should render count values", () => {
      const cell: ListDataFieldValue = {
        type: "count",
        value: 5,
        __nextadmin_formatted: "5",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toBe("5");
    });
  });

  describe("date type", () => {
    it("should render date values", () => {
      const date = new Date("2024-01-01");
      const cell: ListDataFieldValue = {
        type: "date",
        value: date,
        __nextadmin_formatted: "2024-01-01",
      };

      const { container } = render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      expect(container.textContent).toContain("2024-01-01");
    });
  });

  describe("ReactElement at top level", () => {
    it("should render ReactElement directly when provided as __nextadmin_formatted", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: "test",
        __nextadmin_formatted: <span data-testid="top-level">Top Level</span>,
      };

      render(
        <CellWrapper>
          <Cell cell={cell} />
        </CellWrapper>
      );

      const element = screen.getByTestId("top-level");
      expect(element).toBeDefined();
      expect(element.textContent).toBe("Top Level");
    });
  });
});
