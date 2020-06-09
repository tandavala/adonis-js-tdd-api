"use strict";

const Factory = use("Factory");
const Thread = use("App/Models/Thread");
const { test, trait, afterEach } = use("Test/Suite")("Thread Functional test");

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

test("authorized user can delete threads", async ({ assert, client }) => {
  const thread = await Factory.model("App/Models/Thread").create();
  // const user = await Factory.model("App/Models/User").create();
  const owner = await thread.user().first();

  const response = await client
    .delete(`threads/${thread.id}`)
    .loginVia(owner)
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

test("thread can not be deleted by a user who did not create it", async ({
  client,
}) => {
  const thread = await Factory.model("App/Models/Thread").create();
  const notOwner = await Factory.model("App/Models/User").create();
  const response = await client
    .delete(thread.url())
    .send()
    .loginVia(notOwner)
    .end();
  response.assertStatus(403);
});

test("authorized user can update title and body of threads", async ({
  assert,
  client,
}) => {
  const thread = await Factory.model("App/Models/Thread").create();
  const owner = await thread.user().first();
  const attributes = { title: "new title", body: "new body" };
  const updatedThreadAttributes = { ...thread.toJSON(), ...attributes };

  const response = await client
    .put(thread.url())
    .loginVia(owner)
    .send(attributes)
    .end();
  await thread.reload();

  response.assertStatus(200);
  response.assertJSON({ thread: thread.toJSON() });
  assert.deepEqual(thread.toJSON(), updatedThreadAttributes);
});

test("unauthenticated user cannot update threads", async ({
  assert,
  client,
}) => {
  const thread = await Factory.model("App/Models/Thread").create();
  const response = await client.put(thread.url()).send().end();
  response.assertStatus(401);
});

test("thread can not be updated by a user who did not create it", async ({
  assert,
  client,
}) => {
  const thread = await Factory.model("App/Models/Thread").create();
  const notOwner = await Factory.model("App/Models/User").create();
  const response = await client
    .put(thread.url())
    .send()
    .loginVia(notOwner)
    .end();
  response.assertStatus(403);
});
