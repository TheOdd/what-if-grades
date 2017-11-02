// Check if user is on gradebook page as opposed to dashboard
if (window.location.href !== 'https://apps.houstonisd.org/ParentStudentConnect/GradeSpeed.aspx') {
  $(document).ready(function() {

    // Create button element to be placed next to each grade
    var button = $('<span/>', {
      text: ' ✍',
      class: 'edit-grade-button',
      style: 'cursor: pointer;'
    });

    var tables = $('table.DataTable').slice(1).children(); // Get all data tables (aka grade sections)
    var addGrade = $('<tr class="DataRow add-grade-row"><td class="AssignmentName"><button class="script-add-grade-button">Add new grade</button></td><td class="DateAssigned">&nbsp;</td><td class="DateDue">&nbsp;</td><td class="script-placeholder">&nbsp;</td><td class="AssignmentNote">&nbsp;</td><td>&nbsp;</td></tr>'); // Create row elements for buttons
    var addGradeAlt = $('<tr class="DataRowAlt add-grade-row"><td class="AssignmentName"><button class="script-add-grade-button">Add new grade</button></td><td class="DateAssigned">&nbsp;</td><td class="DateDue">&nbsp;</td><td class="script-placeholder">&nbsp;</td><td class="AssignmentNote">&nbsp;</td><td>&nbsp;</td></tr>'); // Create row elements for buttons
    tables.each(function addButton() { // Add the 'add new grade' button to each section at the bottom
      var targetRow = $(this).children().last().prev(); // Get last row from current table
      if (targetRow.attr('class') === 'DataRow') { // Check if either alt style or regular style
        targetRow.addClass('script-add-grade-alt'); // Based on condition, add appropriate style
      } else {
        targetRow.addClass('script-add-grade'); // Based on condition, add appropriate style
      }
    });
    $('.script-add-grade-alt').after(addGradeAlt).removeClass('script-add-grade-alt'); // For whatever reason, trying to add the addGrade elements
    $('.script-add-grade').after(addGrade).removeClass('script-add-grade'); // after the targetrow while in the loop did not work, but this did.

    $('.script-add-grade-button').click(function clickHandler(e) {
      e.preventDefault(); // Prevent default action (redirection)
      var myButton = button.clone(); // Normally, you can only assign an element once. That can be to multiple targets, but I can't do it just once in this case,
                                     // so I make a copy of the element after each click in order to make a unique element for that click to be assigned
      var currentRow = $(this).parent().parent(); // Get two parents above in order to get actual row element
      var assignmentName = prompt('Assignment name.'); // Prompt user for assignment name and store it in a variable
      var row = $('<tr class="DataRow"><td class="AssignmentName">' + assignmentName + '</td><td class="DateAssigned">N/A</td><td class="DateDue">N/A</td><td class="AssignmentGrade script-grade">' + 0 + '</td><td class="AssignmentNote"></td></tr>'); // Create element to be placed as new grade row
      var rowAlt = $('<tr class="DataRowAlt"><td class="AssignmentName">' + assignmentName + '</td><td class="DateAssigned">N/A</td><td class="DateDue">N/A</td><td class="AssignmentGrade script-grade">' + 0 + '</td><td class="AssignmentNote"></td></tr>'); // Create element to be placed as new grade row
      if (currentRow.attr('class').match(/(DataRow\b|DataRowAlt\b)/)[0] === 'DataRow') { // Match regex pattern for either DataRow or DataRowAlt
        currentRow.removeClass('DataRow').addClass('DataRowAlt').before(row).prev().children('.script-grade').after(myButton); // Invert data row CSS and add button next to new grade
      } else {
        currentRow.removeClass('DataRowAlt').addClass('DataRow').before(rowAlt).prev().children('.script-grade').after(myButton); // Invert data row CSS and add button next to new grade
      }
      currentRow.prev().children('.script-grade').next().trigger('click'); // Initiate the click event handler to trigger chain of events to handle new grades
    });

    // 'AssignmentGrade' is a class attached to all grade elements on the page, including the headers titled 'Grade'
    $('.AssignmentGrade').filter(function removeHeaders(index, elem) {
      return $(this).text() !== 'Grade' && $(this).text() !== 'Exc'; // Exclude headers from jQuery selection result
    }).addClass('script-grade'); // Assign all remaining elements a class so it could be easily referenced later

    // Pretty much some magic numbers here, but they should stay consistent with the way that the gradebook is layed out.
    // 'tbody' elements are the elements surrounding each section of grades (i.e. classwork, homework, projects, etc.), but also
    // include the overall grades at the top, as well as the 'Current Average' section for the currently selected grades.
    $('tbody')
    .slice(2) // The first two 'tbody' elements are the overall grades and current average section, which we don't want.

    .children('tr:not([class])') // The children of those remaining 'tbody' elements all have classes except for the averages listed at the bottom,
                                 // so get the elements that don't have a class.

    .children() // The children of those elements are just 4 elements. 2 of them are strange blank characters (not spaces, which is weird), 1 of them
                // is the title of 'Average', and the last is the actual average.
    .filter(function filterOnlyAvg(index, elem) {
      return $(this).text() !== " " && $(this).text() !== "Average"; // Filter out to only get the actual averages
    }).addClass('script-avg'); // Assign all remaining elements a class so it could be easily referenced later

    $('.script-grade').after(button); // Add the button next to every grade that we tagged earlier
    $('.edit-grade-button').next().next().remove() // Remove extra indentation, as button replaced it

    $(document).on('avg-change', '.script-avg', function handleAvgChange() { // Listen for when the averages change
      var calcArr = []; // Create empty array that will be populated later w/ [weight, avg] pairs
      var weightArr = $('.CategoryName').contents(); // Base selection of weights
      var avgArr = $('.script-avg').contents(); // Base selection of averages

      weightArr = Array.from(weightArr); // The selection is technically an element group or something. Pretty much not an array.

      // If there is only one weight, then it's automatically 100%, so check.

      if (weightArr.length > 1) {
        weightArr = weightArr.map(function parseWeight(weightStr) {
          var txt = $(weightStr).text(); // Since each element in the array is an HTML element, we parse it with the jQuery wrapper
          return parseInt(txt.slice(txt.length - 3, txt.length - 1)); // We then slice the string to be only the percent number at the end and parse it as an integer.
        });
      } else {
        weightArr = [100]; // Set to 100% if only one section
      }

      avgArr = Array.from(avgArr); // Repeat same process as above w/ averages
      avgArr = avgArr.map(function parseAvg(avgStr) {
        var txt = $(avgStr).text();
        return parseFloat(txt); // Just parse each element's text as a float, not an int
      });

      var totalWeight = 0; // Make variable to hold the total present weight in order to get ratio of 100 later

      for (var i = 0; i < weightArr.length; i++) {
        if (!isNaN(avgArr[i])) { // Filter out only averages that actually exists. Get rid of '--' or blank averages.
          calcArr.push([weightArr[i], avgArr[i]]); // Push the result to the calcArr as a pair of both the weight and average.
          totalWeight += weightArr[i]; // Add weight to total.
        }
      }

      var weightedAvg = 0; // Create variable for the new overall class average based on changed numbers
      var ratio = 100 / totalWeight; // Calculate ratio - 100% over the total weight present
      calcArr.forEach(function sumWeightedAvg(pair) {
        weightedAvg += (pair[0] * (ratio/100)) * pair[1]; // Calculate the weighted result for each average and add them to the total.
      });

      $('.CurrentAverage').text('Current Average: ' + weightedAvg.toFixed(2)); // Finally, set the 'Current Average' text to the newly-calculated average
    });

    $(document).on('grade-change', '.script-grade', function handleGradeChange() { // Listen for when grades change
      var avg = $(this).closest('tbody').find('.script-avg'); // Find closest average
      var gradeArr = $(this).closest('tbody').children().children('.script-grade').contents(); // Get array of all grades in current section

      gradeArr = Array.from(gradeArr); // Same process as with the weightArr above
      gradeArr = gradeArr.map(function parseGrades(gradeStr) {
        return parseInt($(gradeStr).text()); // Parse the text into a float
      });

      var newAvg = 0; // Make variable to store newly-calculated average
      gradeArr.forEach(function sumGrades(grade) {
        newAvg += grade; // Add all grades together from array
      });
      newAvg /= gradeArr.length; // Divide total by number of grades to get average
      avg.text(newAvg.toFixed(2)); // Set average text to the new average
      avg.trigger('avg-change'); // Trigger the average change event
    });

    $(document).on('click', '.edit-grade-button', function handleBtnClick() { // Listen for when the edit buttons are clicked
      var grade = $(this).prev(); // Get the grade associated with the clicked button
      var newGrade = Number(prompt('New value')); // Prompt user for new value
      while (isNaN(newGrade)) { // Re-Prompt until user enters valid number
        newGrade = Number(prompt('New value'));
      }
      grade.text(newGrade); // Set grade's text to new value
      grade.trigger('grade-change'); // Trigger the grade change event
    });
  });
} else { // If user is on page where you select 'grades', run this

  // The reason why we can't operate on the regular page is because the grade elements and everything that we need to work on
  // is inside an iFrame, which we can't access due to security restrictions. Luckily, the iFrame source is just a link to another page,
  // so just redirect them to that actual page and everything will be loaded as normal without being wrapped in an iFrame container.

  $(document).ready(function changeLink() {
    $('#ctl00_ln_close').text("Open 'what if' grade viewer"); // Set the text of the 'Close GradeBook' link (which is never used) to open grades page in standalone tab
    $('#ctl00_ln_close').attr('href', 'https://parent.gradebook.houstonisd.org/pc/ParentStudentGrades.aspx'); // Set to proper link
  });
}
