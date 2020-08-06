//on ready, disable select unless severe infection is clicked
$(document).ready(function() {
  $("input[name='indication']").change(function() {
    if ($(this).val() === 'severe infection') {
      $("#specificSevereIndication").prop("disabled", false);
    }else{
      $("#specificSevereIndication").prop("disabled", true);
      $("#specificSevereIndication").prop('selectedIndex',0);
      let formGroupSSI = $('#specificSevereIndication').parents('.form-group');
      let messageSSI = formGroupSSI.find(".message");
      formGroupSSI.removeClass("has-error");
      formGroupSSI.removeClass("has-success");
      messageSSI.remove();
    }
  });
});

//on button group click, add to check to active button
$(".type").click(function(){
  $(".type").removeClass("checked");
  $(this).addClass("checked");
});


//get form values and do calculations after submit
$("#initalcalculations").on("validation-success", function (event){
  let age = document.getElementById("age").value;
  let weight = document.getElementById('weight').value;
  let weightUnits = document.getElementById('weightunits').value;
  let height = document.getElementById('height').value;
  let heightUnits = document.getElementById('heightunits').value;
  let scr = document.getElementById('scr').value;
  let vdcalc = document.getElementById('vdcalc').value;
  let indications = document.getElementsByName("indication");
  let indication;
  for (let buttons of indications){
    if(buttons.checked){
      indication = buttons.value;
    }
  }
  let specificSevereIndication = document.getElementById('specificSevereIndication').value;
  let desAUC = 500;
  let genderButtonGroup = document.getElementsByName("gender");
  let gender;
  for (let button of genderButtonGroup){
    if(button.checked){
      gender = button.value
    }
  }
  let inHeight;
  let cmHeight;
  let kgWeight;
  let lbWeight;

  if (weightUnits == "lb"){
    kgWeight = poundsToKilograms(weight);
    lbWeight = weight;
  }else if(weightUnits == "kg"){
    lbWeight = kilogramToPounds(weight);
    kgWeight = weight;
  }

  if (heightUnits == "in"){
    cmHeight = inchesToCentimeter(height);
    inHeight = height;
  }else if(heightUnits == "cm"){
    inHeight = centimeterToInches(height);
    cmHeight = height;
  }

  let reportedIndication = "";
  if(indication == "severe infection"){
    reportedIndication = indication + ": " + specificSevereIndication;
  }else{
    reportedIndication = indication;
  }
  let crclWeightType = determineBodyWeightForCrCl(gender, inHeight, kgWeight)[1];
  let crcl = creatineClearance(gender, age, determineBodyWeightForCrCl(gender, inHeight, kgWeight)[0], scr)
  let predictedLoadingDose = determineLoadingDose(indication, kgWeight);
  let predictedDosingInterval = determineDosingInterval(indication, crcl);
  let vancomycinClearance = vancoClearance(crcl);
  let vd = determineVd(vdcalc, kgWeight);
  let ke = determineKe(crcl, vd);
  let predictedMaintenanceDose = maintenanceDose(ke, vd, predictedDosingInterval, desAUC);

  //table information
  let patientInfo = [{
    "Age (years)": age,
    "Sex (male/female)": gender,
    "TBW (kg)": kgWeight,
    "TBW (lb)": lbWeight,
    "Height (in)": inHeight,
    "Height (cm)": cmHeight,
    "SCr (mg/dl)": scr,
    "Vd (L/kg)": vdcalc,
    "CrCl weight used": crclWeightType,
    "Indication": reportedIndication,
  }];

  let dosingInfo = [{
    "Vd (L)": vd,
    "Ke (1/h)" : ke,
    "CrCl (ml/min)": crcl,
    "Desired AUC (mg*hr/L)": desAUC,
    "Recommended Loading Dose (mg)": predictedLoadingDose,
    "Recommended Maintenance Dose (mg)": predictedMaintenanceDose,
    "Recommended Dosing Interval (hr)": predictedDosingInterval
  }];

  let table = document.querySelector("#patientinfo");
  let data = Object.keys(patientInfo[0]);
  let table2 = document.querySelector("#dosinginfo");
  let data2 = Object.keys(dosingInfo[0]);

  //table generation
  generateTable(table, patientInfo);
  generateTableHead(table, header, "Submitted Patient Information");
  generateTable(table2, dosingInfo);
  generateTableHead(table2, header, "Calculated Dosing Information");

  $(this).addClass("done-with-tables");
});

//handles event when a person clicks submit again
$("#initalcalculations").on("new-tables", function ( event ) {
  $(this).removeClass("done-with-tables")
  $("table >").remove();
  $("#initalcalculations").trigger("validation-success");
});
