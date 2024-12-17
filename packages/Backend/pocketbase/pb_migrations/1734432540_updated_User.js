/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4062664176")

  // update collection data
  unmarshal({
    "authRule": "",
    "manageRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4062664176")

  // update collection data
  unmarshal({
    "authRule": null,
    "manageRule": "@request.auth.role = \"Admin\"\n"
  }, collection)

  return app.save(collection)
})
