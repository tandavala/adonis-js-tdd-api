"use strict";

const Factory = use("Factory");
const Thread = use("App/Models/Thread");
const { test, trait, afterEach } = use("Test/Suite")("Thread");

trait("Test/ApiClient");
trait("Auth/Client");

afterEach(async () => {
  await Thread.query().delete();
});

test("can create threads", async ({ client }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .post("/threads")
    .loginVia(user)
    .send({
      title: "test title",
      body: "body",
    })
    .end();

  response.assertStatus(200);

  const thread = await Thread.firstOrFail();
  response.assertJSON({ thread: thread.toJSON() });
});

test("can delete threads", async ({ assert, client }) => {
  const thread = await Factory.model("App/Models/Thread").create();
  const user = await Factory.model("App/Models/User").create();

  const response = await client
    .delete(`threads/${thread.id}`)
    .loginVia(user)
    .send()
    .end();
  console.log(response.error);
  response.assertStatus(204);
  assert.equal(await Thread.getCount(), 0);
});

test("unauthenticated user cannot create threads", async ({ client }) => {
  const response = await client
    .post("/threads")
    .send({
      title: "test title",
      body: "body",
    })
    .end();

  response.assertStatus(401);
});

test("authorized user can create threads", async ({ client }) => {
  const user = await Factory.model("App/Models/User").create();
  const attributes = {
    title: "test title",
    body: "body",
  };

  const response = await client
    .post("/threads")
    .loginVia(user)
    .send(attributes)
    .end();
  response.assertStatus(200);

  const thread = await Thread.firstOrFail();
  response.assertJSON({ thread: thread.toJSON() });
  response.assertJSONSubset({ thread: { ...attributes, user_id: user.id } });
});
