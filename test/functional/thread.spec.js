"use strict";

const Factory = use("Factory");
const Thread = use("App/Models/Thread");
const { test, trait, afterEach } = use("Test/Suite")("Thread");

trait("Test/ApiClient");

afterEach(async () => {
  await Thread.query().delete();
});

test("can create threands", async ({ client }) => {
  const response = await client
    .post("/threads")
    .send({
      title: "test title",
      body: "body",
    })
    .end();

  const thread = await Thread.firstOrFail();
  response.assertJSON({ thread: thread.toJSON() });

  response.assertStatus(200);
});

test("can delete threads", async ({ assert, client }) => {
  const thread = await Factory.model("App/Models/Thread").create();

  const response = await client.delete(`threads/${thread.id}`).send().end();
  console.log(response.error);
  response.assertStatus(204);
  assert.equal(await Thread.getCount(), 0);
});
