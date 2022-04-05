{
    init: function(elevators, floors) {
        
       
        for (let elevator of elevators) {
            elevator.on("floor_button_pressed", function(floorNum) {
                if (elevator.loadFactor() > .5) elevator.goToFloor(floorNum)
            })
            
        }
        
        
    },
        update: function(dt, elevators, floors) {
            for (let elevator of elevators) {
                let queue = elevator.getPressedFloors()
                if (elevator.loadFactor() > .5) elevator.goToFloor(queue.length > 0 ? queue[0] : 0)
            }
        }
}