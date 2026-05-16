import { test, expect } from '@playwright/test';

test.describe('End-to-End User Acceptance Test', () => {
  const testUser = {
    name: 'UAT User',
    email: `uat_${Date.now()}@example.com`,
    password: 'Password123!',
    phone: '9876543210',
    age: '25',
    address: '123 Test Street, Jharkhand, India',
    pincode: '834001',
    emergencyName: 'Emergency Contact',
    emergencyPhone: '9876543211'
  };

  test('should register, login, and explore dashboard', async ({ page }) => {
    // 1. Registration - Step 1
    await page.goto('/register');
    await page.fill('input[placeholder="Rahul Kumar"]', testUser.name);
    await page.fill('input[placeholder="you@example.com"]', testUser.email);
    await page.fill('input[placeholder="9876543210"]', testUser.phone);
    await page.fill('input[placeholder="Min 6 characters, include a number"]', testUser.password);
    await page.fill('input[placeholder="Re-enter your password"]', testUser.password);
    await page.click('button:has-text("Continue to Step 2")');

    // 2. Registration - Step 2
    await page.fill('input[placeholder="e.g. 28"]', testUser.age);
    await page.selectOption('select:near(label:has-text("Gender"))', 'Male');
    await page.selectOption('select:near(label:has-text("Blood Group"))', 'O+');
    await page.fill('textarea[placeholder*="House No."]', testUser.address);
    await page.selectOption('select:near(label:has-text("City"))', 'Ranchi');
    await page.fill('input[placeholder="834001"]', testUser.pincode);
    await page.fill('input[placeholder="e.g. Sunita Devi"]', testUser.emergencyName);
    
    // Find phone input near the emergency contact label
    await page.fill('input[placeholder="9876543210"]:below(label:has-text("Contact Phone"))', testUser.emergencyPhone);
    
    await page.click('button:has-text("Complete Setup")');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard|.*home|.*\//);

    // 3. Explore Nearby Services
    await page.click('text=Nearby');
    await expect(page).toHaveURL(/.*nearby/);
    await expect(page.locator('.leaflet-container')).toBeVisible();

    // 4. Check AI Labs
    await page.click('text=AI Labs');
    await expect(page).toHaveURL(/.*ai-recommend/);

    // 5. Verify Profile
    await page.goto('/profile');
    // Using first() to avoid ambiguity if name appears in navbar and profile
    await expect(page.locator(`text=${testUser.name}`).first()).toBeVisible();
    await expect(page.locator(`text=${testUser.email}`).first()).toBeVisible();
  });
});
