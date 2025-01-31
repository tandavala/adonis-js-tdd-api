"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

/*
Route.resource("threads", "ThreadController")
  .only(["store", "destroy", "update"])
  .middleware(
    new Map([
      [["store", "destroy", "update"], ["auth"]],
      [["destroy", "update"], ["modifyThreadPolicy"]],
    ])
  )
  .validator(new Map([[["store"], ["StoreThread"]]]));
*/

Route.group(() => {
  Route.get("", "ThreadController.index");

  Route.get(":id", "ThreadController.show");

  Route.post("", "ThreadController.store")
    .middleware("auth")
    .validator("StoreThread");
  Route.put(":id", "ThreadController.update")
    .middleware("auth", "modifyThreadPolicy")
    .validator("StoreThread");
  Route.delete(":id", "ThreadController.destroy").middleware(
    "auth",
    "modifyThreadPolicy"
  );
}).prefix("threads");
