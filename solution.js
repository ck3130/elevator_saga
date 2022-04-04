{
    init: function(elevators, floors) {
        let elevator = elevators[0];

        // Add event listeners to each floor
        for (let floor of floors) {
            if (floor.floorNum() < floors.length) floor.on("up_button_pressed", function(){
                elevator.goToFloor(floor.floorNum());
            });
            if (floor.floorNum() > 0) floor.on("down_button_pressed", function(){
                elevator.goToFloor(floor.floorNum());
            });
        }

        // Add event listener for elevator buttons
        elevator.on("floor_button_pressed", function(floorNum) {
            elevator.goToFloor(floorNum);
        })

        // Filter elevator destination queue to avoid unproductive trips
        elevator.on("stopped_at_floor", function(floorNum) {
            elevator.destinationQueue = elevator.destinationQueue.filter(x => x != floorNum);
            elevator.checkDestinationQueue();
        })
        
        // Check to see if a floor being passed should be stopped at
        elevator.on("passing_floor", function(floorNum, direction){
            
            if (elevator.destinationQueue.some(x => x == floorNum)) elevator.destinationQueue.unshift(floorNum);
            elevator.checkDestinationQueue();
        })


    },
        update: function(dt, elevators, floors) {
            
        }
}