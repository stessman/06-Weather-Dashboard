# Unit 06 Homework : Weather-Dashboard

This is the homework assignment for Unit 06 Server Side API's

<img src="assets\img\weatherDashboard.PNG">

## What problem are we trying to solve
This project was created as a way for people to track and alter their daily activities in a schedule format. When the user opens the scheduler they are presented at the top of the page with today's day of the week, month, and day. As they scroll down the page they are presented with timeblocks for common work hours. These timeblocks are color coded as grey for past hours of the day, red for the current hour, and green for future hours of the day. The user is able to enter text into the timeblocks and click on the corresponding save button to save that information for that hour. To clear out the text in a given hour the user must erase all of the text in the timeblock and then click the save button. The saved information on the scheduler will persist on page load and page reload.

## Requirements
- When the user opens the planner then the current day is displayed at the top of the calendar.
- When the user scrolls down the page then they are presented with timeblocks for standard business hours.
- When the user views the timeblocks for that day then each timeblock is color coded to indicate whether it is in the past, present, or future.
- When the user clicks into a timeblock then they can enter an event.
- When the user clicks on the save button for that time timeblock then the text for that event is saved in local storage.
- When the user refreshes the page then the saved events persist.

## Notes
I believe that this project went very well. The functionality of my code fits the requirements of this task. There may be some nicer ways of selecting elements and traversing the DOM than what I did in my functions, but overall everything works as expected with no errors.

Link to the live site: [Work Day Scheduler](https://stessman.github.io/05-Work-Day-Scheduler/)