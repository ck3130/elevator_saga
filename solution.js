{
    init: function(elevators, floors) {
        
        function floorAssign(elevators){
            // Function to see which elevator has the least number of queued destinations. 
            let assignedElevator = elevators[0];
            let taskCount = 0;
            for (let elevator of elevators) {
                if (elevator.destinationQueue.length == 0) {
                    taskCount = 0;
                    return elevator;
                } else if (taskCount == 0) {
                    taskCount = elevator.destinationQueue.length;
                    assignedElevator = elevator;
                } else if(elevator.destinationQueue.length < taskCount) {
                    taskCount = elevator.destinationQueue.length;
                    assignedElevator = elevator;
                };
            };
            return assignedElevator;
        }
        
        function clearFloor(floor, elevators) {
            // This function clears floor events that were added to elevators if a different elevator was recently at that floor
            // It differentiates between where the elevator as called from a floor vs a passenger on board
            // If a passenger needs to travel to that floor, it will still make that trip
            for (let elevator of elevators) {
                let pressedFloors = elevator.getPressedFloors();
                if (elevator.destinationQueue.some(x => x == floor) && !pressedFloors.some(x => x == floor)) {
                    elevator.destinationQueue = elevator.destinationQueue.filter(x => x != floor);
                    elevator.checkDestinationQueue();
                };
            };
        }

        // Add event listeners to each floor
        for (let floor of floors) {
            if (floor.floorNum() < floors.length) floor.on("up_button_pressed", function(){
                floorAssign(elevators).goToFloor(floor.floorNum())
            });
            if (floor.floorNum() > 0) floor.on("down_button_pressed", function(){
                floorAssign(elevators).goToFloor(floor.floorNum())
            });
        }

        // Add event listener for elevator buttons for each elevator
        for (let elevator of elevators) {
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum);
            })
        }

        // Filter elevator destination queue to avoid unproductive trips for each elevator
        for (let elevator of elevators) {
            elevator.on("stopped_at_floor", function(floorNum) {
                elevator.destinationQueue = elevator.destinationQueue.filter(x => x != floorNum);
                elevator.checkDestinationQueue();
                clearFloor(floorNum, elevators);                
            })
       }

        // Check to see if a floor being passed should be stopped at
        for (let elevator of elevators) {
            elevator.on("passing_floor", function(floorNum, direction){
                if (
                    (elevator.destinationQueue.some(x => x == floorNum) && elevator.loadFactor() < .75) 
                    || elevator.getPressedFloors().some(x => x == floorNum)
                ) elevator.destinationQueue.unshift(floorNum);
                elevator.checkDestinationQueue();
            })
        }
    },
        update: function(dt, elevators, floors) {
        }
}