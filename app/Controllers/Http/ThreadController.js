"use strict";

const { validate } = use("Validator");
const Thread = use("App/Models/Thread");

class ThreadController {
  async store({ request, response, auth }) {
    const rules = { title: "required", body: "required" };
    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.badRequest();
    }
    /*
    if (!request.input("body") || !request.input("title")) {
      return response.badRequest();
    }*/
    const thread = await auth.user
      .threads()
      .create(request.only(["title", "body"]));
    return response.json({ thread });
  }

  async update({ request, params, response }) {
    const thread = await Thread.findOrFail(params.id);

    thread.merge(request.only(["title", "body"]));
    await thread.save();

    return response.json({ thread });
  }

  async destroy({ params, response, auth }) {
    await Thread.query().where("id", params.id).delete();
  }
}

module.exports = ThreadController;
