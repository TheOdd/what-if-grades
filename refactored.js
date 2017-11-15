if (window.location.href !== 'https://apps.houstonisd.org/ParentStudentConnect/GradeSpeed.aspx') {
  $(document).ready(() => {
    const button = $('<span/>', {
      text: ' ✍',
      class: 'edit-grade-button',
      style: 'cursor: pointer;'
    })

    const tables = $('table.DataTable').slice(1).children()
    const addGrade = $('<tr class="DataRow add-grade-row"><td class="AssignmentName"><button class="script-add-grade-button">Add new grade</button></td><td class="DateAssigned">&nbsp;</td><td class="DateDue">&nbsp;</td><td class="script-placeholder">&nbsp;</td><td class="AssignmentNote">&nbsp;</td><td>&nbsp;</td></tr>')
    const addGradeAlt = $('<tr class="DataRowAlt add-grade-row"><td class="AssignmentName"><button class="script-add-grade-button">Add new grade</button></td><td class="DateAssigned">&nbsp;</td><td class="DateDue">&nbsp;</td><td class="script-placeholder">&nbsp;</td><td class="AssignmentNote">&nbsp;</td><td>&nbsp;</td></tr>')
    tables.each(function addButton() {
      const targetRow = $(this).children().last().prev()
      targetRow.attr('class') === 'DataRow' ?
      targetRow.addClass('script-add-grade-alt') : targetRow.addClass('script-add-grade')
    })
    $('.script-add-grade-alt').after(addGradeAlt).removeClass('script-add-grade-alt')
    $('.script-add-grade').after(addGrade).removeClass('script-add-grade')

    $('.script-add-grade-button').click(function clickHandler(e) {
      e.preventDefault()
      const myButton = button.clone()
      const currentRow = $(this).parent().parent()
      const assignmentName = prompt('Assignment name.')
      const row = $('<tr class="DataRow"><td class="AssignmentName">' + assignmentName + '</td><td class="DateAssigned">N/A</td><td class="DateDue">N/A</td><td class="AssignmentGrade script-grade">' + 0 + '</td><td class="AssignmentNote"></td></tr>')
      const rowAlt = $('<tr class="DataRowAlt"><td class="AssignmentName">' + assignmentName + '</td><td class="DateAssigned">N/A</td><td class="DateDue">N/A</td><td class="AssignmentGrade script-grade">' + 0 + '</td><td class="AssignmentNote"></td></tr>')
      if (currentRow.attr('class').match(/(DataRow\b|DataRowAlt\b)/)[0] === 'DataRow')
        currentRow.removeClass('DataRow').addClass('DataRowAlt').before(row).prev().children('.script-grade').after(myButton)
      else
        currentRow.removeClass('DataRowAlt').addClass('DataRow').before(rowAlt).prev().children('.script-grade').after(myButton)
      currentRow.prev().children('.script-grade').next().trigger('click')
    })

    $('.AssignmentGrade').filter(function removeHeaders() {
      return $(this).text() !== 'Grade' && $(this).text() !== 'Exc'
    }).addClass('script-grade')

    $('tbody')
    .slice(2)
    .children('tr:not([class])')
    .children()
    .filter(function filterOnlyAvg() {
      return $(this).text() !== ' ' && $(this).text() !== 'Average'
    }).addClass('script-avg')

    $('.script-grade').after(button)
    $('.edit-grade-button').next().next().remove()

    $(document).on('avg-change', '.script-avg', () => {
      const calcArr = []
      let weightArr = Array.from($('.CategoryName').contents())
      let avgArr = Array.from($('.script-avg').contents())

      if (weightArr.length > 1) {
        weightArr = weightArr.map(weightStr => {
          const txt = $(weightStr).text()
          return parseInt(txt.slice(txt.length - 3, txt.length - 1))
        })
      } else {
        weightArr = [100]
      }

      weightArr.filter(e => !isNaN(e)).forEach((e, i) => {
        calcArr.push([weightArr[i], avgArr[i]])
        totalWeight += weightArr[i]
      })

      let weightedAvg = 0
      const ratio = 100 / totalWeight
      calcArr.forEach(pair => {
        weightedAvg += (pair[0] * (ratio/100)) * pair[1]
      })

      $('.CurrentAverage').text('Current Average: ' + weightAvg.toFixed(2))
    })

    $(document).on('grade-change', '.script-grade', function handleGradeChange() {
      const avg = $(this).closest('tbody').find('.script-avg')
      const gradeArr = Array.from(
        $(this).closest('tbody').children().children('.script-grade').contents()
      ).map(gradeStr => parseInt($(gradeStr).text()))

      let newAvg = 0
      gradeArr.forEach(grade => newAvg += grade)
      newAvg /= gradeArr.length
      avg.text(newAvg.toFixed(2))
      avg.trigger('avg-change')
    })

    $(document).on('click', '.edit-grade-button', function handleBtnClick() {
      const grade = $(this).prev()
      let newGrade = Number(prompt('New value'))
      while (isNaN(newGrade)) {
        newGrade = Number(prompt('New value'))
      }
      grade.text(newGrade)
      grade.trigger('grade-change')
    })
  })
} else {
  $(document).ready(() => {
    $('#ctl00_ln_close').text("Open 'what if' grade viewer")
    $('#ctl00_ln_close').attr('href', 'https://parent.gradebook.houstonisd.org/pc/ParentStudentGrades.aspx')
  })
}
