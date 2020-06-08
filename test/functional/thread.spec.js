"use strict";

const Thread = use("App/Models/Thread");
const { test, trait } = use("Test/Suite")("Thread");

trait("Test/ApiClient");

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
