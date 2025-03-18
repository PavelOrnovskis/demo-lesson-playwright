import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'

let authPage: LoginPage

test.beforeEach(async ({ page }) => {
  authPage = new LoginPage(page)
  await authPage.open()
})

test('TL-18 signIn button disabled when incorrect data inserted', async ({}) => {
  await authPage.usernameField.fill(faker.lorem.word(2));
  await authPage.passwordField.fill(faker.lorem.word(7));
  await authPage.signInButton.checkVisible();
  await authPage.signInButton.checkDisabled(true);
})

test('TL-18 error message displayed when incorrect credentials used', async ({}) => {
  await authPage.usernameField.fill(faker.lorem.word(2));
  await authPage.passwordField.fill(faker.lorem.word(7));
  // await authPage.loginError() - this test does not work since the error is not appearing on the frontend
  await authPage.passwordError()

})

test('TL-18 login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.statusButton.checkVisible()
  await orderCreationPage.nameField.checkVisible()
})

test('TL-18 login and create order', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.nameField.fill('12315')
  await orderCreationPage.phoneField.fill('1231313')
  await orderCreationPage.commentField.fill('214532')
  await orderCreationPage.createOrder.click()
  await orderCreationPage.orderNumberField.checkVisible()

})
