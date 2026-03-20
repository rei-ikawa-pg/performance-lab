import { test, expect } from "@playwright/test";

test.describe("Measure flow", () => {
  test("shows sign-in prompt for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Sign in with Google")).toBeVisible();
    await expect(page.getByText("Performance Lab")).toBeVisible();
  });

  test("redirects to home from protected routes when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/");
  });

  test("report page redirects when not authenticated", async ({ page }) => {
    await page.goto("/report/test-id");
    await page.waitForURL("/");
  });
});
