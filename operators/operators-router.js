const router = require('express').Router();

const Operators = require('./operators-model');
const Diners = require('../diners/diners-model.js')

const restricted = require('../auth/restricted-middleware.js');
const checkRole = require('../auth/check-role-middleware-operator.js');

router.get('/:id/CustomerMenuAvg', restricted, checkRole(), (req,res) => {
  Diners.findByCustomerRatingMenuAvg(req.params.id)
    .then(avg => {
      res.status(200).json(Object.values(avg[0])[0])
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/:id/CustomerTruckAvg', restricted, checkRole(), (req,res) => {
  Diners.findByCustomerRatingTruckAvg(req.params.id)
    .then(avg => {
      res.status(200).json(Object.values(avg[0])[0])
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/:id', restricted, checkRole(), (req,res) => {
    console.log(req)
    
    Operators.findById(req.params.id)
        .then(operator => {
            res.status(201).json(operator)
        })
        .catch(err => {
            res.status(500).json({error: "the operator could not be retrieved"})
        })
});

router.get('/:id/all', restricted, checkRole(), (req,res) => {
    console.log(req)
    
    Operators.findOperatorTrucks(req.params.id)
        .then(operator => {
            res.status(201).json(operator)
        })
        .catch(err => {
            res.status(500).json({error: "the operator could not be retrieved"})
        })
});


// TRUCK CRUD


router.post('/:id/truck', restricted, checkRole(), validateOperatorId, validateTruckInfo, (req,res) => {
  
    
    
      Diners.findByCustomerRatingTruckAvg(req.params.id)
        .then(avg => {
          const newTruck = {
            operator_id: req.params.id,
            truckName: req.body.truckName,
            imageOfTruck: req.body.imageOfTruck,
            cuisineType: req.body.cuisineType,
            currentLocation: req.body.currentLocation,
            departureTime: req.body.departureTime,
            customerRatingAvg: Object.values(avg[0])
        }
        Operators.findByTruckName(req.body.truckName)
          .then(truck => {
            if(truck.length > 0) {
              res.status(400).json({ error: "Truck name must be unique" });
            } else {
              Operators.addTruck(newTruck)
                .then(truck => {
                    res.status(201).json(truck);
                })
                .catch(err => {
                    res.status(500).json({ error: "There was an error while saving the task to the database" });
              })
            }
          })
        })
})


router.put('/:id/truck', restricted, checkRole(), validateTruckId, validateTruckInfo,(req, res) => {
    // const updateTruck = {
    //     operator_id: req.params.id,
    //     truckName: req.body.truckName,
    //     imageOfTruck: req.body.imageOfTruck,
    //     cuisineType: req.body.cuisineType,
    //     currentLocation: req.body.currentLocation,
    //     departureTime: req.body.departureTime
    // }
    
    Diners.findByCustomerRatingTruckAvg(req.params.id)
        .then(avg => {
          const updateTruck = {
            operator_id: req.params.id,
            truckName: req.body.truckName,
            imageOfTruck: req.body.imageOfTruck,
            cuisineType: req.body.cuisineType,
            currentLocation: req.body.currentLocation,
            departureTime: req.body.departureTime,
            customerRatingAvg: Object.values(avg[0])[0]
        }
        Operators.findByTruckName(req.body.truckName)
          .then(truck => {
            if(truck.length > 0) {
              res.status(400).json({ error: "Truck name must be unique" });
            } else {
              Operators.updateTruck(req.params.id, updateTruck)
                .then(post => {
                  res.status(200).json(post);
                })
                .catch(err => {
                  res.status(500).json({error: "The truck information could not be modified"});
                })
              }
          })
        })   
  });

router.delete('/:id/truck', restricted, checkRole(), validateTruckId, (req, res) => {
    Operators.removeTruck(req.params.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        res.status(500).json({error: "The truck could not be removed"});
      })
});

// MENU CRUD

router.post('/:id/menu', restricted, checkRole(), validateMenuInfo,(req,res) => {

    const newMenuItem = {
        truck_id: req.params.id,
        itemName: req.body.itemName,
        itemDescription: req.body.itemDescription,
        itemPrice: req.body.itemPrice,
    }

    console.log(newMenuItem)

    Operators.addMenuItem(newMenuItem)
        .then(item => {
            console.log(item)
            res.status(201).json(item);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the item to the database" });
        })
})

router.put('/:id/menu', restricted, checkRole(), validateMenuId, validateMenuInfo, (req, res) => {
    
    Diners.findByCustomerRatingMenuAvg(req.params.id)
        .then(avg => {
          console.log(Object.values(avg[0])[0])
          const updateMenuItem = {
            itemName: req.body.itemName,
            itemDescription: req.body.itemDescription,
            itemPrice: req.body.itemPrice,
            customerRatingAvg: Object.values(avg[0])[0]
        }
        console.log(updateMenuItem)
        Operators.updateMenuItem(req.params.id, updateMenuItem)
          .then(post => {
            res.status(200).json(post);
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({error: "The menu information could not be modified"});
          })
      })   
  });

router.delete('/:id/menu', restricted, checkRole(), validateMenuId, (req, res) => {
    Operators.removeMenuItem(req.params.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        res.status(500).json({error: "The menu could not be removed"});
      })
});

// ITEMPHOTOS CRUD

router.post('/:id/item-photo', restricted, checkRole(), validateMenuId, validatePhotoInfo, (req,res) => {

    const newItemPhoto = {
        menu_id: req.params.id,
        image: req.body.image
    }

    Operators.addItemPhotos(newItemPhoto)
        .then(item => {
            console.log(item)
            res.status(201).json(item);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the item to the database" });
        })
})

router.put('/:id/item-photo', restricted, checkRole(), validateItemPhotoId, validatePhotoInfo, (req, res) => {
    const updatePhoto = {
        image: req.body.image
    }
  
    Operators.updateItemPhotos(req.params.id, updatePhoto)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({error: "The photo could not be modified"});
      })
  });

router.delete('/:id/item-photo', restricted, checkRole(), validateItemPhotoId, (req, res) => {
    Operators.removeItemPhotos(req.params.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        res.status(500).json({error: "The photo could not be removed"});
      })
});



// Validate Id

function validateOperatorId(req, res, next) {
    const {id} = req.params;
    Operators.findById(id)
      .then(user => {
        if(user) {
          req.user = user;
          next();
        } else {
          res.status(400).json({ message: "invalid operator id" });
        }   
      })
      .catch(err => {
        res.status(500).json({message: 'exception error'});
      })
}

// Validate Menu

function validateMenuId(req, res, next) {
    const {id} = req.params;
    Operators.findByIdMenu(id)
      .then(menu => {
        if(menu) {
          req.menu = menu;
          next();
        } else {
          res.status(400).json({ message: "invalid menu id" });
        }   
      })
      .catch(err => {
        res.status(500).json({message: 'exception error'});
      })
}

function validateMenuInfo(req, res, next) {
  const postData = req.body;
  if(postData.itemName === "") {
      res.status(400).json({ message: "item name can not be empty" });
  }  else if (!postData.itemDescription && !postData.itemPrice) {
      res.status(400).json({ message: 'missing item description and item price field'})
  } else if (!postData.itemDescription) {
      res.status(400).json({ message: 'missing item description field'})
  } else if (!postData.itemPrice){
      res.status(400).json({ message: 'missing item price field'})
  } else {
      next();
  }
}

// Validate Truck

function validateTruckId(req, res, next) {
    const {id} = req.params;
    Operators.findByIdTruck(id)
      .then(truck => {
        if(truck) {
          req.truck = truck;
          next();
        } else {
          res.status(400).json({ message: "invalid truck id" });
        }   
      })
      .catch(err => {
        res.status(500).json({message: 'exception error'});
      })
}

function validateTruckInfo(req, res, next) {
  const postData = req.body;
   if (postData.truckName === "" || !postData.imageOfTruck || !postData.imageOfTruck || !postData.cuisineType || !postData.currentLocation || !postData.departureTime) {
      res.status(400).json({ message: 'missing field/s'})
  }  else {
      next();
  }
}

//Validate Photo

function validateItemPhotoId(req, res, next) {
    const {id} = req.params;
    Operators.findByIdItemPhotos(id)
      .then(item => {
        if(item) {
          req.item = item;
          next();
        } else {
          res.status(400).json({ message: "invalid photo id" });
        }   
      })
      .catch(err => {
        res.status(500).json({message: 'exception error'});
      })
}

function validatePhotoInfo(req, res, next) {
  const postData = req.body;
  if(postData.image === "") {
      res.status(400).json({ message: "image can not can not be empty" });
  } else {
      next();
  }
}

module.exports = router;
