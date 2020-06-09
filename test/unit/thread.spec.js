"use strict";

const Factory = use("Factory");
const { test, trait, afterEach } = use("Test/Suite")("Thread Unit Test");
const Thread = use("App/Models/Thread");

afterEach(async () => {
  await Thread.query().delete();
});

trait("DatabaseTransactions");

test("can access url", async ({ assert }) => {
  const thread = await Factory.model("App/Models/Thread").create();
  assert.equal(thread.url(), `threads/${thread.id}`);
});
