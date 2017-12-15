if (window.location.href !== 'https://apps.houstonisd.org/ParentStudentConnect/GradeSpeed.aspx') {
  $(document).ready(() => {
    const editGradeButton = $('<span/>', {
      text: ' ✍',
      class: 'edit-grade-button',
      style: 'cursor: pointer;'
    })

    // TODO: Actually make the edit final buttons and click handlers into one button and function. Probably a generator that
    // takes an argument to return either one for semester 1 or 2.

    const editFinalOneButton = $('<span/>', {
      text: ' ✍',
      class: 'edit-final-1-button',
      style: 'cursor: pointer;'
    })

    const editFinalTwoButton = $('<span/>', {
      text: ' ✍',
      class: 'edit-final-2-button',
      style: 'cursor: pointer;'
    })

    const deleteGradeButton = $('<span/>', {
      text: ' ❌',
      class: 'delete-grade-button',
      style: 'cursor: pointer;'
    })

    const mainTable = $('table.DataTable').children().children().slice(1)
    const tables = $('table.DataTable').slice(1).children()
    const generateGradeRow = style => (
      `
      <tr class="${style} add-grade-row">
        <td class="AssignmentName">
          <button class="script-add-grade-button">Add new grade</button>
        </td>
        <td class="DateAssigned">&nbsp;</td>
        <td class="DateDue">&nbsp;</td>
        <td class="script-placeholder">&nbsp;</td>
        <td class="AssignmentNote">&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      `
    )
    tables.each(function addButton() {
      const targetRow = $(this).children().last().prev()
      targetRow.addClass(
        targetRow.attr('class') === 'DataRow' ? 'script-add-grade' : 'script-add-grade-alt'
      )
    })

    mainTable.each(function addFinalOne() {
      const finalElem = $($(this).children()[7])
      if (finalElem.text().charCodeAt(0) === 160)
        finalElem.text('')
      finalElem.append(editFinalOneButton.clone())      
    })

    mainTable.each(function addFinalTwo() {
      const finalElem = $($(this).children()[12])
      if (finalElem.text().charCodeAt(0) === 160)
        finalElem.text('')
      finalElem.append(editFinalTwoButton.clone())
    })

    $(document).on('click', '.edit-final-2-button', function handleFinalTwoAddition() {
      const curRow = $(this).parent().parent()
      const c4 = $(curRow.children()[9])
      const c5 = $(curRow.children()[10])
      const c6 = $(curRow.children()[11])
      const sem2 = $(curRow.children()[13])
      const validGrades = [c4.text(), c5.text(), c6.text()].filter(s => s.charCodeAt(0) !== 160)
      const numOfGrades = validGrades.length
      let newGrade = Number(prompt('New value'))
      while (isNaN(newGrade)) {
        newGrade = Number(prompt('New value'))
      }
      if ($(this).parent().text().length > 2)
        $(this).parent().text(newGrade).append(editFinalTwoButton.clone())
      else
        $(this).before(newGrade)
      const newSemGrade = (validGrades.map(n => parseInt(n)).reduce((a, b) => a + b, 0) + parseInt(newGrade)) / (numOfGrades + 1)
      sem2.text(Math.round(newSemGrade))
    })

    $(document).on('click', '.edit-final-1-button', function handleFinalOneAddition() {
      const curRow = $(this).parent().parent()
      const c1 = $(curRow.children()[4])
      const c2 = $(curRow.children()[5])
      const c3 = $(curRow.children()[6])
      const sem1 = $(curRow.children()[8])
      const validGrades = [c1.text(), c2.text(), c3.text()].filter(s => s.charCodeAt(0) !== 160)
      const numOfGrades = validGrades.length
      let newGrade = Number(prompt('New value'))
      while (isNaN(newGrade)) {
        newGrade = Number(prompt('New value'))
      }
      if ($(this).parent().text().length > 2)
        $(this).parent().text(newGrade).append(editFinalOneButton.clone())
      else
        $(this).before(newGrade)
      const newSemGrade = (validGrades.map(n => parseInt(n)).reduce((a, b) => a + b, 0) + parseInt(newGrade)) / (numOfGrades + 1)
      sem1.text(Math.round(newSemGrade))
    })

    $('.script-add-grade-alt').after(generateGradeRow('DataRow')).removeClass('script-add-grade-alt')
    $('.script-add-grade').after(generateGradeRow('DataRowAlt')).removeClass('script-add-grade')

    $('.script-add-grade-button').click(function clickHandler(e) {
      e.preventDefault()
      const currentRow = $(this).parent().parent()
      const assignmentName = prompt('Assignment name.')
      const generateNewRow = style => (
        `
        <tr class="${style}">
          <td class="AssignmentName">${assignmentName}</td>
          <td class="DateAssigned">N/A</td>
          <td class="DateDue">N/A</td>
          <td class="AssignmentGrade script-grade">0</td>
          <td class="AssignmentNote"></td>
        </tr>
        `
      )
      const addNewGradeToDOM = style => {
        currentRow.removeClass(style)
        .addClass(style === 'DataRow' ? 'DataRowAlt' : 'DataRow')
        .before(generateNewRow(style))
        .prev()
        .children('.script-grade')
        .after(editGradeButton.clone())

        currentRow.prev().children().first().prepend(deleteGradeButton.clone())
      }
      if (currentRow.attr('class').match(/(DataRow\b|DataRowAlt\b)/)[0] === 'DataRow')
        addNewGradeToDOM('DataRow')
      else
        addNewGradeToDOM('DataRowAlt')
      currentRow.prev().children('.script-grade').next().trigger('click')
    })

    $('.AssignmentGrade').filter(function removeHeaders() {
      return $(this).text() !== 'Grade' && $(this).text() !== 'Exc'
    }).addClass('script-grade')

    $('.script-grade').each(function addDeleteButtons() {
      const nameElem = $(this).prev().prev().prev()
      nameElem.prepend(deleteGradeButton.clone())
    })

    $('tbody')
    .slice(2)
    .children('tr:not([class])')
    .children()
    .filter(function filterOnlyAvg() {
      return $(this).text() !== ' ' && $(this).text() !== 'Average'
    }).addClass('script-avg')

    $('.script-grade').after(editGradeButton)
    $('.edit-grade-button').next().next().remove()

    $(document).on('avg-change', '.script-avg', () => {
      const calcArr = []
      let weightArr = Array.from($('.CategoryName').contents())
      let avgArr = Array.from($('.script-avg').contents()).map(str => (
        parseFloat($(str).text())
      ))

      if (weightArr.length > 1) {
        weightArr = weightArr.map(weightStr => {
          const txt = $(weightStr).text()
          return parseInt(txt.slice(txt.length - 3, txt.length - 1))
        })
      } else
        weightArr = [100]

      let totalWeight = 0

      avgArr.forEach((e, i) => {
        if (!isNaN(e)) {
          calcArr.push([weightArr[i], e])
          totalWeight += weightArr[i]
        }
      })

      let weightedAvg = 0
      const ratio = 100 / totalWeight
      calcArr.forEach(pair => {
        weightedAvg += (pair[0] * (ratio / 100)) * pair[1]
      })

      $('.CurrentAverage').text('Current Average: ' + Math.round(weightedAvg))
    })

    $(document).on('grade-change', '.script-grade', function handleGradeChange() {
      const avg = $(this).closest('tbody').find('.script-avg')
      const gradeArr = Array.from(
        $(this).closest('tbody').children().children('.script-grade').contents()
      ).map(gradeStr => {
        if ($(gradeStr).text() === 'mis') return 0
        
        else
          return parseFloat($(gradeStr).text())
      })

      let newAvg = gradeArr.reduce((a, b) => a + b, 0)
      newAvg /= gradeArr.length
      avg.text(newAvg.toFixed(2))
      avg.trigger('avg-change')
    })

    $(document).on('click', '.edit-grade-button', function handleEditClick() {
      const grade = $(this).prev()
      let newGrade = Number(prompt('New value'))
      while (isNaN(newGrade)) {
        newGrade = Number(prompt('New value'))
      }
      grade.text(newGrade)
      grade.trigger('grade-change')
    })

    $(document).on('click', '.delete-grade-button', function handleDeleteClick() {
      const rowBefore = $(this).parent().parent().prev().children('.script-grade')
      const rowAfter = $(this).parent().parent().next().children('.script-grade')
      if ($(this).parent().parent().parent().children().length === 4) {
        $(this).parent().parent().parent().children().last().children('.script-avg').first().text('--')
        $(this).parent().parent().remove()
        $('.script-avg').first().trigger('avg-change')
      } else if ($(this).parent().parent().prev().children().first().text() !== 'Assignment') {
        $(this).parent().parent().remove()
        rowBefore.trigger('grade-change')
      } else {
        $(this).parent().parent().remove()
        rowAfter.trigger('grade-change')
      }
    })
  })
} else {
  $(document).ready(() => {
    $('#ctl00_ln_close').text("Open 'what if' grade viewer")
    $('#ctl00_ln_close').attr('href', 'https://parent.gradebook.houstonisd.org/pc/ParentStudentGrades.aspx')
  })
}
