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
        
        function doWork(queue) {
            // Find the floor where the most work can be done. 
            if (queue.length == 0) return undefined
            let valuesPresent = queue.values();
            // Set as first value in queue. Return this is all values counts are same
            let floor = queue[0];
            let highestCount = 0;
            for (let value of valuesPresent) {
                let tempCount = queue.filter(x => x == value).length;
                if (highestCount == 0) {
                    highestCount = tempCount
                } else {
                    if (tempCount > highestCount) {
                        highestCount = tempCount;
                        floor = value;
                    };
                };
            };
        }
        

        // Filter elevator destination queue to avoid unproductive trips
        elevator.on("stopped_at_floor", function(floorNum) {
            elevator.destinationQueue = elevator.destinationQueue.filter(x => x != floorNum);
            let bestFloor = doWork(elevator.destinationQueue);
            elevator.destinationQueue = bestFloor ? [bestFloor, ...elevator.destinationQueue] : elevator.destinationQueue;
            elevator.checkDestinationQueue();
            
        })


    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}