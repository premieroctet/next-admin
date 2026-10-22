import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import Cell from "./Cell";
import { ConfigProvider } from "../context/ConfigContext";
import type { ListDataFieldValue } from "../types";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    basePath="/admin"
    apiBasePath="/api/admin"
    nextAdminContext={{ locale: "en" }}
  >
    {children}
  </ConfigProvider>
);

describe("Cell component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("boolean fields with formatters", () => {
    it("should render JSX from boolean formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: <span data-testid="custom-bool">Active</span>,
      };

      const formatter = (value: boolean) => (
        <span data-testid="custom-bool">
          {value ? "Active" : "Inactive"}
        </span>
      );

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} formatter={formatter} getRawData={() => true} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("Active");
      expect(container.querySelector('[data-testid="custom-bool"]')).toBeTruthy();
    });

    it("should not display [object Object] for boolean with JSX formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: false,
        __nextadmin_formatted: (
          <span data-testid="custom-bool">Inactive</span>
        ),
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).not.toContain("[object Object]");
      expect(container.textContent).toContain("Inactive");
      expect(container.querySelector('[data-testid="custom-bool"]')).toBeTruthy();
    });

    it("should render default boolean display when formatter returns string", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: "Yes",
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("Yes");
    });

    it("should render boolean toString when no formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: "true",
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("true");
    });
  });

  describe("string fields with formatters", () => {
    it("should render JSX from string formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: "test",
        __nextadmin_formatted: <strong data-testid="custom-str">Test</strong>,
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("Test");
      expect(container.querySelector('[data-testid="custom-str"]')).toBeTruthy();
    });

    it("should not display [object Object] for string with JSX formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: "hello",
        __nextadmin_formatted: <em data-testid="custom-str">Hello World</em>,
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).not.toContain("[object Object]");
      expect(container.textContent).toContain("Hello World");
      expect(container.querySelector('[data-testid="custom-str"]')).toBeTruthy();
    });
  });

  describe("number fields with formatters", () => {
    it("should render JSX from number formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: 42,
        __nextadmin_formatted: (
          <span data-testid="custom-num">Forty-two</span>
        ),
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("Forty-two");
      expect(container.querySelector('[data-testid="custom-num"]')).toBeTruthy();
    });

    it("should not display [object Object] for number with JSX formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: 100,
        __nextadmin_formatted: <span data-testid="custom-num">100%</span>,
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).not.toContain("[object Object]");
      expect(container.textContent).toContain("100%");
      expect(container.querySelector('[data-testid="custom-num"]')).toBeTruthy();
    });
  });

  describe("date fields with formatters", () => {
    it("should render JSX from date formatter", () => {
      const cell: ListDataFieldValue = {
        type: "date",
        value: new Date("2024-01-01"),
        __nextadmin_formatted: (
          <time data-testid="custom-date">January 1, 2024</time>
        ),
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("January 1, 2024");
      expect(container.querySelector('[data-testid="custom-date"]')).toBeTruthy();
    });

    it("should not display [object Object] for date with JSX formatter", () => {
      const cell: ListDataFieldValue = {
        type: "date",
        value: new Date("2024-12-31"),
        __nextadmin_formatted: (
          <span data-testid="custom-date">New Year&apos;s Eve</span>
        ),
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} />
        </TestWrapper>
      );

      expect(container.textContent).not.toContain("[object Object]");
      expect(container.textContent).toContain("New Year");
      expect(container.querySelector('[data-testid="custom-date"]')).toBeTruthy();
    });
  });

  describe("copyable cells", () => {
    it("should render copyable boolean field with JSX formatter", () => {
      const cell: ListDataFieldValue = {
        type: "scalar",
        value: true,
        __nextadmin_formatted: <span data-testid="copyable-bool">Yes</span>,
      };

      const { container } = render(
        <TestWrapper>
          <Cell cell={cell} copyable={true} />
        </TestWrapper>
      );

      expect(container.textContent).toContain("Yes");
      expect(container.querySelector('[data-testid="copyable-bool"]')).toBeTruthy();
    });
  });
});
