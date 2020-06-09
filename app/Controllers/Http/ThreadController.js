"use strict";

const Thread = use("App/Models/Thread");

class ThreadController {
  async store({ request, response, auth }) {
    const thread = await auth.user
      .threads()
      .create(request.only(["title", "body"]));
    return response.json({ thread });
  }

  async destroy({ params, response, auth }) {
    const thread = await Thread.findOrFail(params.id);
    if (thread.user_id !== auth.user.id) {
      return response.status(403).send();
    }
    await thread.delete();
  }
}

module.exports = ThreadController;
