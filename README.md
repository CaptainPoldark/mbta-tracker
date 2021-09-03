# mbta-tracker

# MBTA Bus Tracking

### About
This javascript app will display the position of all mass transit busses in the City of Boston in realtime.

#### Files needed:
index.html
mbtaBusTracker.js
assets\styles\styles.css

### Version
v1.5

### Roadmap
Icons will change depending on whether the bus is moving or stopped.
Hover over the icon, and a level meter will show how full the bus is. (version 1.5 now shows text description of occupancy level)
Mark for next stop will be displayed for each bus and estimated time from the stop.
Optional overlay to select and show a bus route trace.

### Issues
Occasionally, when first loading the page the markers don't appear. That's because the markers are trying to load before the map style has finished loading. Refreshing the page resolves this issue.
Implementing additional features such as the next destination, wheelchair accessibility, and allowed bikes relies on being able to return the full array from MBTA. Currently, the code only returns json.data. The other features are located in json.included, this code would need to be able to match the index of the bus in .data with its attributes in .include. 

### Credits

Jonathankyle Brooks

#### Tags
#MIT, #MBTA, #BOSTON