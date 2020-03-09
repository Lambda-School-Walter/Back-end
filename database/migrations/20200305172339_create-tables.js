exports.up = function(knex) {
    return knex.schema
      .createTable('diners', tbl => {
        tbl.increments();
        tbl.string('username', 128)
          .unique()
          .notNullable()
        tbl.string('password', 128)
          .notNullable()
        tbl.string('email', 128)
          .notNullable()
        tbl.string('currentLocation', 255)
        tbl.string('role', 128).notNullable().defaultTo('diner')
      })
      .createTable('operators', tbl => {
        tbl.increments();
        tbl.string('username', 128)
          .unique()
          .notNullable()
        tbl.string('password', 128)
          .notNullable()
        tbl.string('email', 128)
          .notNullable()
        tbl.string('role', 128).notNullable().defaultTo('operator')
      })
      .createTable('trucks', tbl => {
        tbl.increments()
        tbl.string('truckName', 128).notNullable()
        tbl.string('imageOfTruck', 128);
        tbl.string('cuisineType', 128).notNullable()
        tbl.decimal('customerRatingAvg', 14, 2)
        tbl.integer('operator_id')
            .unsigned()
            .notNullable()
            .references('operators.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        })
        .createTable('location_truck', tbl => {
            tbl.increments();
            tbl.string('address', 128).notNullable()
            tbl.text('longitude')
            tbl.text('latitude')
            tbl.time('departureTime')
            tbl.integer('truck_id')
                .unsigned()
                .notNullable()
                .references('trucks.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
        .createTable('menuItems', tbl => {
            tbl.increments()
            tbl.string('itemName', 128).notNullable()
            tbl.string('itemDescription', 255);
            tbl.decimal('itemPrice', 14, 2).notNullable()
            tbl.decimal('customerRatingAvg', 14, 2)
            tbl.integer('truck_id')
                .unsigned()
                .notNullable()
                .references('trucks.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
        .createTable('itemPhotos', tbl => {
            tbl.increments();
            tbl.string('image', 128).notNullable()
            tbl.integer('menu_id')
                .unsigned()
                .notNullable()
                .references('menuItems.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
        .createTable('customer_rating_truck', tbl => {
            tbl.increments();
            tbl.integer('rating').notNullable()
            tbl.integer('truck_id')
                .unsigned()
                .notNullable()
                .references('trucks.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            tbl.integer('diner_id')
                .unsigned()
                .notNullable()
                .references('diners.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
        .createTable('customer_rating_menu', tbl => {
            tbl.increments();
            tbl.integer('rating').notNullable()
            tbl.integer('menu_id')
                .unsigned()
                .notNullable()
                .references('menuItems.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            tbl.integer('diner_id')
                .unsigned()
                .notNullable()
                .references('diners.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
        .createTable('favourite_trucks', tbl => {
            tbl.increments()
            tbl.string('username', 128)
            tbl.string('truckName', 128)
            tbl.string('cuisineType', 128)
            tbl.string('imageOfTruck', 128)
            tbl.decimal('customerRatingAvg', 14, 2)
            tbl.text('currentLocation')
            tbl.time('departureTime')
            tbl.integer('operator_id')
            tbl.integer('truck_id')
                .unsigned()
                .notNullable()
                .references('trucks.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            tbl.integer('diner_id')
                .unsigned()
                .notNullable()
                .references('diners.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('favourite_trucks')
      .dropTableIfExists('customer_rating_menu')
      .dropTableIfExists('customer_rating_truck')
      .dropTableIfExists('ItemPhotos')
      .dropTableIfExists('menuItems')
      .dropTableIfExists('location_truck')
      .dropTableIfExists('trucks')
      .dropTableIfExists('operators')
      .dropTableIfExists('diners')
      
      
  };