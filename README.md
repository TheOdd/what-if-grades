# What-If-Grades
## What is it?
A chrome extension that allows for hypothetical calculation of grades for assignments in HISD's GradeSpeed portal. While visiting the [HISD GradeSpeed Portal][1], you'll be able to open a link to the grade viewer. From that page, any specific class that is opened will have a ✍ button inserted next to each assignment grade space. Click the button to edit the corresponding grade's value and both the average for that section as well as the whole class will change accordingly. This also takes the different section's weights on the overall average. (i.e. homework - 10%)

## Why?
I made this because a class-mate of mine had said that he wished that a tool existed for our school district's (HISD) grade viewer (GradeSpeed) that allowed him to see what his grade *would* be if he had X grade on X assignment.

## How?
This extension is made specifically for the HISD GradeSpeed system and will almost certainly not work in any other grade portal. The process that this extension uses is just a series of jQuery selections to hook onto specific parts of the web page such as the grade headers, averages, section headers, etc. From there, it's just a lot of tree traversal to get specific information.

Once all of the information has been gathered, the button element is placed next to each grade element with a click handler. The click handler prompts the user for a new number to replace the grade with. From there, the input is passed down a chain of custom events being triggered. Each event handler calculates a new value and updates the text on the page accordingly.

The process looks something like this:
<p align="center">
  <img src="https://raw.githubusercontent.com/TheOdd/what-if-grades/master/imgs/chart.png" />
</p>

## Demo GIF
<p align="center">
  <details>
    <summary>Click to see demo gif</summary>
    <img src="https://github.com/TheOdd/what-if-grades/blob/master/imgs/demo.gif" />
  </details>
</p>

[1]:https://apps.houstonisd.org/ParentStudentConnect/
