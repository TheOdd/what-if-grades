/*
*
* WIP Refactoring of codebase to become cleaner and easier to read.
* Full context here: https://codereview.stackexchange.com/q/179272/119588
*
*/

var helpers = {
  newButtonElem: function newButton() {
    return $('<span/>', {
      text: ' ✍',
      class: 'edit-grade-button',
      style: 'cursor: pointer;'
    });
  },
  newAddGradeElem: function newAddGradeElem(style) {
    var rowStyle = null;
    if (style === 'alt') {
      rowStyle = 'DataRowAlt';
    } else if (style === 'normal') {
      rowStyle = 'DataRow';
    } else {
      throw 'Please specify a valid style for the new addGradeElem!';
    }
    return $('<tr/>', {'class': rowStyle + ' add-grade-row'}).append(
      $('<td/>', {'class': 'AssignmentName'}).append(
        $('<button/>', {'class': 'script-add-grade-button',
                        'text': 'Add new grade'}),
        $('<td/>', {'class': 'DateAssigned',
                    'text': '&nbsp;'}),
        $('<td/>', {'class': 'DateDue'},
                    'text': '&nbsp;'),
        $('<td/>', {'class': 'script-placeholder',
                    'text': '&nbsp;'}),
        $('<td/>', {'class': 'AssignmentNote',
                    'text': '&nbsp;'}),
        $('<td/>', {'text': '&nbsp;'}),
      )
    );
  },
  flipRowStyle: function flipRowStyle(currentRow, assignmentName) {
    var row = null; // Add helper function
    var rowAlt = null; // Add helper function
    var isDataRow = currentRow.attr('class').match(/(DataRow\b|DataRowAlt\b)/)[0] === 'DataRow';
    var rowToAdd = isDataRow ? row : rowAlt;
    var newButton = helpers.newButtonElem();
    var classToRemove = isDataRow ? 'DataRow' : 'DataRowAlt';
    var classToAdd = isDataRow ? 'DataRowAlt': 'DataRow';
    currentRow.removeClass(classToRemove).addClass(classToAdd).before(rowToAdd).prev().children('.script-grade').after(newButton);
  }
}

function insertAddNewGradeButtons() {
  var tables = $('table.DataTable').slice(1).children();
  tables.each(function addButton() {
    var addGrade = helpers.newAddGradeElem('normal');
    var addGradeAlt = helpers.newAddGradeElem('alt');
    var targetRow = $(this).children().last().prev();
    if (targetRow.attr('class') === 'DataRow') {
      targetRow.after(addGradeAlt);
    } else {
      targetRow.after(addGrade);
    }
  });
}

function addGradeButtonClickHandler() {
  $('.script-add-grade-button').click(function clickHandler(e) {
    e.preventDefault();
    var currentRow = $(this).parent().parent();
    var assignmentName = prompt('Assignment name.');
    helpers.flipRowStyle(currentRow, assignmentName);
    currentRow.prev().children('.script-grade').next().trigger('click');
  });
}
