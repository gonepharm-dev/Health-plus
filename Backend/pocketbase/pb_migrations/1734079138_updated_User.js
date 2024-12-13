/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4062664176")

  // update collection data
  unmarshal({
    "authRule": null,
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4062664176")

  // update collection data
  unmarshal({
    "authRule": "",
    "createRule": "@request.auth.role = \"Admin\"\n",
    "deleteRule": "@request.auth.role = \"Admin\"\n",
    "listRule": "@request.auth.role = \"Admin\"\n",
    "updateRule": "@request.auth.role = \"Admin\"\n",
    "viewRule": "@request.auth.role = \"Admin\"\n"
  }, collection)

  return app.save(collection)
})
