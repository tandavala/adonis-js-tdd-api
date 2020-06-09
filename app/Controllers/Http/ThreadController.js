"use strict";

const Thread = use("App/Models/Thread");

class ThreadController {
  async store({ request, response, auth }) {
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
    const thread = await Thread.findOrFail(params.id);
    if (thread.user_id !== auth.user.id) {
      return response.forbidden();
    }
    await thread.delete();
  }
}

module.exports = ThreadController;
