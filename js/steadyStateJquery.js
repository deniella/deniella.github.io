//initialize datetimepicker widgets
$(function () {
    $('#datetimepicker1').datetimepicker({
      format: "MM/DD/YYYY HH:mm",
      sideBySide: true
    });
});
$(function () {
    $('#datetimepicker2').datetimepicker({
      format: "MM/DD/YYYY HH:mm",
      sideBySide: true
    });
});
$(function () {
    $('#datetimepicker3').datetimepicker({
      format: "MM/DD/YYYY HH:mm",
      sideBySide: true
    });
});

//get form values and do calculations after submit
$("#steadystatecalculations").on("validation-success", function (event){
  let dose = parseInt(document.getElementById("dose").value);
  let dosingInterval = parseInt(document.getElementById("dosinginterval").value);
  let infusionDuration = parseFloat(document.getElementById("infusionduration").value);
  let lastDoseGiven = $('#datetimepicker1').data('date');
  let peakTime = $('#datetimepicker2').data('date');
  let troughTime = $('#datetimepicker3').data('date');
  let cMaxMeasured = parseFloat(document.getElementById("cmaxmeasured").value);
  let cMinMeasured = parseFloat(document.getElementById("cminmeasured").value);

  let momentLastDoseGiven = moment(lastDoseGiven, 'MM/DD/YYYY HH:mm');
  let momentNextDoseTime = moment(lastDoseGiven, 'MM/DD/YYYY HH:mm').add(dosingInterval, "h");
  let momentPeakTime = moment(peakTime, 'MM/DD/YYYY HH:mm');
  let momentTroughTime = moment(troughTime, 'MM/DD/YYYY HH:mm');

  let diffLastDoseAndPeak = moment.preciseDiff(momentLastDoseGiven, momentPeakTime, true);
  let diffLastDoseAndTrough = moment.preciseDiff(momentTroughTime, momentNextDoseTime, true);

  //time from end of infusion to time peak drawn
  let tCmax = getHours(diffLastDoseAndPeak) - infusionDuration;
  //time elapsed from trough was drawn to end of infusion
  let tCmin = getHours(diffLastDoseAndTrough) + infusionDuration;

  let diffTroughAndNextDose = moment.preciseDiff(momentTroughTime, momentNextDoseTime, true);
  let t2 = getHours(diffTroughAndNextDose);

  let steadyStateKe = ssKe(cMaxMeasured, cMinMeasured, dosingInterval, tCmax, tCmin);
  let steadyStateTHalfLife = ssTHalfLife(steadyStateKe);
  let steadyStateActualCmax = actualCmax(cMaxMeasured, steadyStateKe, tCmax);
  let steadyStateActualCmin = actualCmin(cMinMeasured, steadyStateKe, t2);
  let steadyStateLinTrap = linTrap(steadyStateActualCmax, steadyStateActualCmin, infusionDuration);
  let steadyStateLogTrap = logTrap(steadyStateActualCmax, steadyStateActualCmin, steadyStateKe);
  let steadyStateAUC0toT = auc0toT(steadyStateLinTrap, steadyStateLogTrap);
  let steadyStateAUC24 = auc24(steadyStateAUC0toT, dosingInterval);
  let steadyStateVd = ssVd(dose, infusionDuration, steadyStateKe, steadyStateActualCmax, steadyStateActualCmin);
  let steadyStateNewDosingInterval = newDosingInterval(infusionDuration, steadyStateKe);
  let steadyStateNewMaintenanceDose = maintenanceDose(steadyStateKe, steadyStateVd, steadyStateNewDosingInterval);

  //table information
  let steadyStatePatientInfo = [{
    "Current Maintenance Dose (mg)": dose,
    "Dosing Interval (hr)": dosingInterval,
    "Infusion Duration (hr)": infusionDuration,
    "Time of Last Dose Given": lastDoseGiven,
    "Peak Time Drawn": peakTime,
    "Peak Concentration (mg/L)": cMaxMeasured,
    "Trough Time Drawn": troughTime,
    "Trough Concentration (mg/L)": cMinMeasured
  }];

  let steadyState = [{
    "Ke (1/hr)": steadyStateKe,
    "T1/2 (hr)": steadyStateTHalfLife,
    "Cmax (mg/L)": steadyStateActualCmax,
    "Cmin (mg/L)": steadyStateActualCmin,
    "AUC24 (mg*hr/L)": steadyStateAUC24
  }];

  let adjustedSteadyStateParameters = [{
    "Vd (L)": steadyStateVd,
    "New Dosing Interval (hr)": steadyStateNewDosingInterval,
    "New Maintenance Dose (mg)": steadyStateNewMaintenanceDose
  }]

  let table3 = document.querySelector("#steadystatepatientinfo");
  let data3 = Object.keys(steadyStatePatientInfo[0]);
  let table4 = document.querySelector("#steadystateinfo");
  let data4 = Object.keys(steadyState[0]);
  let table5 = document.querySelector("#steadystateadjustedinfo");
  let data5 = Object.keys(adjustedSteadyStateParameters[0]);

  //table generation
  generateTable(table3, steadyStatePatientInfo);
  generateTableHead(table3, header, "Submitted Patient Information");
  generateTable(table4, steadyState);
  generateTableHead(table4, header, "Steady State Information");
  if(steadyStateAUC24 < 400 || steadyStateAUC24 > 600){
    generateTableHead(table5, header, "Recommended Dose Changes");
    generateTable(table5, adjustedSteadyStateParameters);
  }
  $(this).addClass("done-with-tables");
});

//handles event when a person clicks submit again
$("#steadystatecalculations").on("new-tables", function ( event ) {
  $(this).removeClass("done-with-tables")
  $("table >").remove();
  $("#steadystatecalculations").trigger("validation-success");
});
