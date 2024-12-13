/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_636022148")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date3109945275",
    "max": "",
    "min": "",
    "name": "appointment_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "scheduled",
      "completed",
      "cancelled"
    ]
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2280979223",
    "max": null,
    "min": null,
    "name": "doctor_id",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1804178041",
    "max": null,
    "min": null,
    "name": "patient_id",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text18589324",
    "max": 0,
    "min": 0,
    "name": "notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2803357667",
    "maxSelect": 1,
    "name": "consultation_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "video",
      "in-person",
      "phone call"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_636022148")

  // remove field
  collection.fields.removeById("date3109945275")

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("number2280979223")

  // remove field
  collection.fields.removeById("number1804178041")

  // remove field
  collection.fields.removeById("text18589324")

  // remove field
  collection.fields.removeById("select2803357667")

  return app.save(collection)
})
